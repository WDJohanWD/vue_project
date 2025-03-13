<template>
  <div class="container mt-4">
    <h2 class="mb-4">Carrito de Compras</h2>
    <div v-if="carritoStore.carrito.length === 0" class="alert alert-info">
      <p>El carrito está vacío.</p>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in carritoStore.carrito" :key="item._id">
            <td class="img-cell">
              <img
                :src="`http://localhost:5000/uploads/img/${item.imagen_url}`"
                alt="Imagen del artículo"
                class="img-fluid"
              />
            </td>
            <td>{{ item.nombre }}</td>
            <td>
              <button class="btn btn-sm btn-secondary" @click="carritoStore.disminuirCantidad(item._id)">-</button>
              <span class="mx-2">{{ item.cantidad }}</span>
              <button class="btn btn-sm btn-primary" @click="carritoStore.aumentarCantidad(item._id)">+</button>
            </td>
            <td>{{ item.precio }}€</td>
            <td>{{ (item.cantidad * item.precio).toFixed(2) }}€</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="carritoStore.eliminarDelCarrito(item._id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="h5">Total: {{ carritoStore.totalPrecio }}€</p>
      <div>
        <button class="btn btn-warning me-1" @click="carritoStore.vaciarCarrito">
          Vaciar Carrito
        </button>
        <button class="btn btn-success ms-1" @click="finalizarPago" :disabled="carritoStore.carrito.length === 0">
          Finalizar Compra
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCarritoStore } from "@/store/carrito.mjs";
import { loadStripe } from "@stripe/stripe-js";

export default {
  name: "TablaCarrito",

  setup() {
    const carritoStore = useCarritoStore();
    return { carritoStore };
  },

  methods: {
    async finalizarPago() {
      const PUBLIC_KEY = process.env.VUE_APP_PUBLIC_KEY;
      const stripe = await loadStripe(PUBLIC_KEY);
      
      const response = await fetch("http://localhost:5000/crear-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: this.carritoStore.carrito, amount: this.carritoStore.totalPrecio }),
      });

      const session = await response.json();
      if (!session.id) {
        console.error("❌ No se recibió sessionId de Stripe.");
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error("Error en el pago:", error);
      }
    },
  },
};
</script>

<style>
.img-cell {
  padding: 0 !important;
  margin: 0 !important;
  width: 10%;
  /* Ajusta el ancho según necesites */
  text-align: center;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
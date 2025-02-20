<template>
    <div>
        <h2>Carrito de Compras</h2>
        <div v-if="carritoStore.carrito.length === 0">
            <p>El carrito está vacío.</p>
        </div>
        <div v-else>
            <ul>
                <li v-for="item in carritoStore.carrito" :key="item._id">
                    {{ item.nombre }} - {{ item.cantidad }} x {{ item.precio }}€
                    <button @click="carritoStore.eliminarDelCarrito(item._id)">Eliminar</button>
                </li>
            </ul>
            <p>Total: {{ carritoStore.totalPrecio }}€</p>
            <button @click="carritoStore.vaciarCarrito">Vaciar Carrito</button>
        </div>
    </div>
</template>

<script>
import { useCarritoStore } from '@/store/carrito.mjs';

export default {
    name: "TablaCarrito",

    setup(){
        const carritoStore = useCarritoStore();

        return { carritoStore };
    }

}
</script>

<style>

</style>
import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
    state: () => ({
        carrito: JSON.parse(localStorage.getItem('carrito')) || [] // Recuperar carrito al iniciar
    }),

    getters: {
        totalArticulos: (state) => state.carrito.reduce((total, item) => total + item.cantidad, 0),
        totalPrecio: (state) => state.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)
    },

    actions: {
        guardarEnLocalStorage() {
            localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Guardar en localStorage
        },

        agregarAlCarrito(articulo) {
            const itemExistente = this.carrito.find(item => item._id === articulo._id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                this.carrito.push({ ...articulo, cantidad: 1, precio: articulo.precio_unitario });
            }
            this.guardarEnLocalStorage(); // Guardar cambios
        },

        eliminarDelCarrito(id) {
            this.carrito = this.carrito.filter(item => item._id !== id);
            this.guardarEnLocalStorage(); // Guardar cambios
        },

        aumentarCantidad(id) {
            const item = this.carrito.find(item => item._id === id);
            if (item) {
                item.cantidad++;
                this.guardarEnLocalStorage(); // Guardar cambios
            }
        },

        disminuirCantidad(id) {
            const item = this.carrito.find(item => item._id === id);
            if (item && item.cantidad > 1) {
                item.cantidad--;
                this.guardarEnLocalStorage(); // Guardar cambios
            } else {
                this.eliminarDelCarrito(id); // Eliminar si la cantidad llega a 0
            }
        },

        vaciarCarrito() {
            this.carrito = [];
            localStorage.removeItem('carrito'); // Eliminar del almacenamiento
        }
    }
});

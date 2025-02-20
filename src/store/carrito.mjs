import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
    state: () => ({
        carrito: []
    }),

    getters: {
        totalArticulos: (state) => state.carrito.reduce((total, item) => total + item.cantidad, 0),
        totalPrecio: (state) => state.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
    },

    actions: {
        agregarAlCarrito(articulo) {
            const itemExistente = this.carrito.find(item => item._id === articulo._id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                this.carrito.push({ ...articulo, cantidad: 1, precio: articulo.precio_unitario });
            }
        },  

        eliminarDelCarrito(id) {
            this.carrito = this.carrito.filter(item => item._id !== id);
        },

        vaciarCarrito() {
            this.carrito = [];
        }
    }
});
<template>
    <div>

        <h3 class="mt-3 text-center front-weight-bold"><i class="bi bi-boxes"></i> GESTIÓN ARTICULOS <router-link
                to="/">
                <button class="btn btn-customb"><i class="bi bi-arrow-return-left "></i></button></router-link></h3>

    </div>

    <br>
    <div class="container-fluid border p-4">
        <form class="form-in-line">
            <div class="col-10 col-m-6 col-lg-8 mx-auto">

                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span  me-2 ">Nombre: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Nombre del artículo"
                        v-model="articulo.nombre" required>


                    <span class="input-group-text custom-span  ms-auto me-2">Categoría:</span>
                    <select class="form-control  w-25" name="" id="" v-model="articulo.categoria" required>
                        <option value="" disabled selected="selected">Seleccionar categoria</option>
                        <option v-for="categoria in categorias" :key="categoria" :value="categoria">
                            {{ categoria }}
                        </option>

                    </select>



                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span  me-2" for="descripcion">Descripción: </span>
                    <textarea placeholder="Descripción del artículo" class="form-control sm w-50" maxlength="256"
                        name="" id="" rows="2" v-model="articulo.descripcion"></textarea>

                    <span class="input-group-text custom-span  ms-auto me-2">Precio Unitario:</span>
                    <input class="form-control sm w-25 text-end" type="text" placeholder="0"
                        v-model="articulo.precio_unitario" required>
                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span   me-2">Stock:</span>
                    <input class="form-control sm w-25 text-end" type="text" placeholder="0"
                        v-model="articulo.stock_disponible" required>

                    <span class="input-group-text custom-span  ms-auto me-2" for="personalizacion">Personalización:
                    </span>
                    <textarea placeholder="Detalles de personalización" class="form-control sm w-50" maxlength="256"
                        name="" id="" rows="2" v-model="articulo.personalizacion"></textarea>


                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span  me-2">Imágen URL:</span>
                    <input type="text" class="form-control sm w-75" placeholder="https://imagen-del-articulo.com">



                    <span class="input-group-text custom-span ms-3 me-2">Fecha Alta:</span>
                    <input type="date" class="form-control sm w-25" v-model="articulo.fecha_alta"
                        placeholder="Fecha Alta">

                </div>
            </div>

            <button class="btn btn-primary m-1" @click="agregarArticulos">Grabar</button>
            <button class="btn btn-primary m-1" @click="limpiarArticulo">Limpiar</button>
        </form>
    </div>


    <div v-if="isAdmin">
        <div class="container my-5">
            <h4 class="mb-4"><i class="bi bi-card-list"></i> Tabla de artículos</h4>
            <div class="container my-2">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead class="table-info rounded-header">
                            <tr>
                                <th scope="col" class="w-15 text-center">ID</th>
                                <th scope="col" class="w-20">Nombre</th>
                                <th scope="col" class="w-20 text-center">Categoría</th>
                                <th scope="col" class="w-10">Descripción</th>
                                <th scope="col" class="w-10">Precio</th>
                                <th scope="col" class="w-10">Stock</th>
                                <th scope="col" class="w-10 text-center">Fecha Alta</th>
                                <th scope="col" class="pale-yellow table-warning">Gestión</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="articulo in articulosPorPagina" :key="articulo.id">
                                <td class="align-middle w-15">{{ acortar_id(articulo._id) }}</td>
                                <td class="align-middle w-20">{{ articulo.nombre }}</td>
                                <td class="align-middle w-20">{{ articulo.categoria }}</td>
                                <td class="align-middle w-10">{{ articulo.descripcion }}</td>
                                <td class="align-middle w-10">{{ articulo.precio_unitario }}</td>
                                <td class="align-middle w-10">{{ articulo.stock_disponible }}</td>
                                <td class="align-middle w-10">{{ acortar_fecha(articulo.fecha_alta) }}</td>

                                <td class="text-center align-middle pale-yellow table-warning">
                                    <div>
                                        <button class="btn btn-warning m-2" @click="editarArticulo(articulo._id)">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button class="btn btn-danger m-2" @click="eliminarArticuloLocal(articulo._id)">
                                            <i class="bi bi-trash"></i>
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="d-flex justify-content-center my-3">
                        <button class="btn btn-primary" :disabled="currentPage === 1" @click="paginaAnterior">
                            <i class="bi bi-chevron-left"> </i>
                        </button>
                        <span class="mx-3 align-self-center">Página {{ currentPage }}</span>

                        <button class="btn btn-primary" :disabled="currentPage * pageSize >= articulos.length"
                            @click="siguientePagina">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { agregarArticulo, actualizarArticulo, obtenerArticulos, eliminarArticulo } from '@/js/articuloServicios.js';
export default {
    name: "TablaArticulos",

    data() {
        return {

            articulo: {
                nombre: '',
                categoria: '',
                descripcion: '',
                precio_unitario: 0,
                stock_disponible: 0,
                personalizacion: '',
                fecha_alta: '',

            },
            categorias: [
                "Electrónica",
                "Hogar",
                "Ofimática",
                "Deporte",
                "Libros",
                "Otros",
            ],

            isAdmin: false,
            isLogged: false,
            articulos: [],
            errores: [],
            currentPage: 1,
            pageSize: 2,
            isChecked: false,
            editDni: false
        };
    },

    mounted() {
        this.getArticulos();
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogged = localStorage.getItem('isLogueado') === 'true';

    },


    computed: {

        articulosPorPagina() {
            const inicio = (this.currentPage - 1) * this.pageSize;
            return this.articulos.slice(inicio, inicio + this.pageSize);

        },
    },

    methods: {

        acortar_id(id) {
            return id.slice(-4);
        },

        acortar_fecha(fecha) {
            return fecha.slice(0, 10);
        },
        siguientePagina() {
            if (this.currentPage * this.pageSize < this.articulos.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        limpiarArticulo() {
            this.articulo = {
                nombre: '',
                categoria: '',
                descripcion: '',
                precio_unitario: '',
                stock_disponible: '',
                personalizacion: '',
                fecha_alta: '',
            }
        },


        mostrarAlerta(titulo, mensaje, icono) {
            Swal.fire({
                title: titulo,
                text: mensaje,
                icon: icono,
                timer: 1500,
                customClass: {
                    container: 'custom-alert-container',
                    popup: 'custom-alert-popup',
                    modal: 'custom-alert-modal'
                }
            })
        },

        async agregarArticulos(event) {
            event.preventDefault();
            try{
            // Verificar si los campos requeridos están llenos
            if (this.articulo._id) {
                await actualizarArticulo(this.articulo._id, this.articulo);
                this.getArticulos();

                this.mostrarAlerta('¡Actualizado!', 'El artículo ha sido actualizado.', 'success');
            } else {
                const nuevoArticulo = await agregarArticulo(this.articulo);
                this.articulos.push(nuevoArticulo);
                this.mostrarAlerta('Artículo agregado', 'El artículo ha sido agregado exitosamente.', 'success');
            }

            this.limpiarArticulo();} catch (error) {
                this.mostrarAlerta('Error', 'No se pudo agregar el artículo', 'error');
            }
        },

        async getArticulos() {
            this.articulos = await obtenerArticulos()

        },

        async eliminarArticuloLocal(id) {
            try {
                await eliminarArticulo(id);
                this.articulos = this.articulos.filter((articulo) => articulo._id !== id);
                this.mostrarAlerta('¡Eliminado!', 'El artículo ha sido eliminado.', 'success');
            } catch (error) {
                this.mostrarAlerta('Error', 'No se pudo eliminar el artículo', 'error');
            }
        },


        async editarArticulo(id) {
            this.limpiarArticulo();
            const articulo = this.articulos.find((articulo) => articulo._id === id);

            articulo.fecha_alta = new Date(articulo.fecha_alta).toISOString().split('T')[0];
            this.articulo = { ...articulo };
            
        }
    }
}

</script>

<style scoped>
.custom-date-input {
    width: 12em;
    text-align: center;
}
</style>
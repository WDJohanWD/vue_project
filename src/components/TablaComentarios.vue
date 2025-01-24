<template>
    <div>
        <div>
            <h3 class="mt-3 text-center front-weight-bold"><i class="bi bi-chat-left-text"></i> ZONA DE COMENTARIOS
                <router-link to="/">
                    <button class="btn btn-customb"><i class="bi bi-arrow-return-left "></i></button>
                </router-link>
            </h3>
        </div>
    </div>
    <br />
    <div class="container-fluid border p-4">
        <!-- FORMULARIO -->
        <form class="form-in-line">
            <p v-if="!isLogged" class="text-danger"> Debes acceder para poder comentar</p>
            <div class="col-10 col-m-6 col-lg-8 mx-auto">
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span  me-2">Email: </span>
                    <input type="email" class="form-control sm w-75 me-2" placeholder="Email"
                        v-model="comentario.clienteEmail" @blur="validarEmail(this.comentario.clienteEmail)" required  readonly/>

                    <span class="input-group-text custom-span ms-2 me-2">Móvil:</span>
                    <input class="form-control sm w-25" type="text" placeholder="Número de móvil"
                        v-model="comentario.clienteMovil" @blur="validarTelefono(this.comentario.clienteMovil)"
                        required />
                </div>

                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span  me-2">Mensaje: </span>
                    <textarea class="form-control sm w-100" placeholder="Contenido del mensaje (Máximo 256 caracteres)"
                        maxlength="256" v-model="comentario.clienteMensaje"></textarea>
                </div>

                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Valoración</span>
                    <div class="star-valor text-start w-100">
                        <span v-for="n in 5" :key="n"
                            :class="n <= this.comentario.clienteValor ? 'bi bi-star-fill' : 'bi bi-star'"
                            @click="setValor(n)" class="star-icon"></span>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-light m-1" @click="limpiarFormComentario()">
                            <i class="bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
                <input type="checkbox" class="text-align-left" name="" id="" v-model="comentario.lopd" required> He
                leido y
                acepto la <router-link to="/privacidad">Politica de privacidad</router-link> <br>
                <button class="btn btn-primary m-1" @click.prevent="grabarComentario">
                    Enviar comentarios
                </button>
            </div>
        </form>

        <!-- TABLA COMENTARIOS -->
        <div class="container my-5">
            <h4 class="mb-4"><i class="bi bi-file-earmark-bar-graph"></i> TABLA DE COMENTARIOS</h4>
            <div class="container my-2">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead class="table-info rounded-header">
                            <tr>
                                <th v-if="isAdmin" scope="col" class="w-15 text-center">ID</th>
                                <th scope="col" class="w-20 text-center">Fecha</th>
                                <th scope="col" class="w-20 text-start">Email</th>
                                <th scope="col" class="w-20 text-center">Mensaje</th>
                                <th scope="col" class="w-10 text-center">Valoración</th>
                                <th scope="col" class="pale-yellow table-warning" v-if="isAdmin">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="comentario in comentariosPorPagina" :key="comentario.id">
                                <td v-if="isAdmin" class="align-middle">{{ comentario.id }}</td>
                                <td class=" align-middle">
                                    {{ comentario.fechaComentario }}
                                </td>
                                <td class="text-start align-middle">{{ comentario.clienteEmail }}</td>
                                <td class="align-middle">{{ comentario.clienteMensaje }}</td>
                                <td class="align-middle">{{ comentario.clienteValor }}</td>
                                <td v-if="isAdmin" class="text-center align-middle pale-yellow table-warning">
                                    <div>
                                        <button class="btn btn-warning m-2" @click="seleccionarComentario(comentario)">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button class="btn btn-danger m-2" @click="eliminarComentario(comentario)">
                                            <i class="fas fa-trash-alt"></i>
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

                        <button class="btn btn-primary" :disabled="currentPage * pageSize >= comentarios.length"
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
import Swal from "sweetalert2";

export default {
    name: "TablaExamen",
    components: {},

    data() {
        return {
            comentario: {

                clienteEmail: "",
                clienteMensaje: "",
                fechaComentario: "",
                clienteMovil: "",
                clienteValor: 1,
                lopd: "",

            },

            comentarios: [],
            usuarios: [],
            currentPage: 1,
            pageSize: 5,
            isAdmin: false,
            isLogged: false,
            dniUsuario: '',
        };

    },

    async mounted() {
        this.getComentarios();
        await this.getUsuarios();
        this.valoresIniciales();
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogged = localStorage.getItem('isLogueado') === 'true';
        this.dniUsuario = localStorage.getItem('dni');
        this.comentario.clienteEmail = await this.obtenerNombre(this.dniUsuario);


    },
    computed: {

        comentariosPorPagina() {
            const inicio = (this.currentPage - 1) * this.pageSize;
            return this.comentarios.slice(inicio, inicio + this.pageSize);

        },

    },
    methods: {
        async obtenerNombre(dni) {
            const usuario = this.usuarios.find((user) => user.dni === dni);
            if (usuario) {
                return usuario.email;
            } else {
                console.error('Usuario no encontrado');
            }
        },
        siguientePagina() {
            if (this.currentPage * this.pageSize < this.comentarios.length) {
                this.currentPage++;
            }
        },
        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        async valoresIniciales() {
            this.comentario.fechaComentario = this.obtenerFechaHoy();

        },
        setValor(n) {
            this.comentario.clienteValor = n;
        },
        async getComentarios() {
            try {
                const response = await fetch("http://localhost:3000/comentarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud:" + response.statusText);
                }

                this.comentarios = (await response.json()
                );
            } catch (error) {
                console.error(error);
            }
        },

        validarEmail(email) {
            if (email == "") {
                this.mostrarAlerta("Error", "El email con formato no valido", "error");
            }
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email)) {
                this.mostrarAlerta("Error", "El email con formato no valido", "error");
            }

            let flag = false;
            this.usuarios.forEach(usuario => {
                if (usuario.email === email) {
                    flag = true;
                }

            });

            if (!flag) {
                this.mostrarAlerta("Error", "El email no existe", "error")
            }


        },

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud:' + response.statusText);
                }
                this.usuarios = (await response.json());
            } catch (error) {
                console.error(error);
            }
        },

        validarTelefono(telefono) {
            if (telefono == '') {
                this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error');
            }
            const regex = /^[67]\d{8}$/;
            if (!regex.test(telefono)) {
                this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
            }
        },


        async seleccionarComentario(comentario) {
            try {
                this.limpiarFormComentario();
                const response = await fetch("http://localhost:3000/comentarios");
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                const comentarios = await response.json();

                // Encontrar el comentario por su DNI
                const comentarioEncontrado = comentarios.find(
                    (c) => c.id === comentario.id
                );

                if (comentarioEncontrado) {
                    this.comentario = { ...comentarioEncontrado };
                    console.log("Comentario encontrado");
                } else {
                    this.mostrarAlerta(
                        "Error",
                        "Comentario no encontrado en el servidor.",
                        "error"
                    );
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta(
                    "Error",
                    "No se pudo cargar el comentario desde el servidor.",
                    "error"
                );
            }
        },


        mostrarAlerta(titulo, mensaje, icono) {
            Swal.fire({
                title: titulo,
                text: mensaje,
                icon: icono,
                customClass: {
                    container: "custom-alert-container",
                    popup: "custom-alert-popup",
                    modal: "custom-alert-modal",
                },
            });
        },

        limpiarFormComentario() {
            this.comentario = {
                id: "",
                clienteEmail: "",
                clienteMensaje: "",
                fechaComentario: "",
                clienteMovil: "",
                clienteValor: "",
                lopd: "",
            };

            this.clienteValor = 1
        },

        obtenerFechaHoy() {
            const fecha = new Date();
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
            //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
            return fechaFormateada;
        },

        async grabarComentario() {
            const resultado = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas grabar el comentario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Grabar',
                cancelButtonText: 'No, no grabar',
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
            })

            if (resultado.isConfirmed) {

                if (this.comentario.clienteEmail && this.comentario.clienteMovil) {
                    try {
                        if (!this.comentario.lopd) {
                            this.mostrarAlerta("Error", "Tienes que aceptar las condiciones", "error")

                        } else {
                            if (!this.isLogged) {
                                this.mostrarAlerta("Error", "Tienes que estar logueado", "error")
                            } else {
                                const response = await fetch('http://localhost:3000/comentarios');
                                if (!response.ok) {
                                    throw new Error('Error al obtener los comentarios: ' + response.statusText);
                                }
                                else {
                                    const crearResponse = await fetch('http://localhost:3000/comentarios', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(this.comentario),
                                    });

                                    if (!crearResponse.ok) {
                                        throw new Error('Error al guardar el comentario ' + crearResponse.statusText);
                                    }

                                    const nuevoComentario = await crearResponse.json();
                                    this.comentarios.push(nuevoComentario);
                                    this.mostrarAlerta('Aviso', 'Comentario grabado correctamente', 'success');
                                    this.limpiarFormComentario();
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        this.mostrarAlerta('Error', 'No se pudo grabar el comentario.', 'error');
                    }
                }
                else {
                    this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
                }

            }
        },

        async eliminarComentario(comentario) {
            const resultado = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas eliminar el comentario?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "No, cancelar",
                cancelButtonColor: "#d33",
                confirmButtonColor: "#3085d6",
            });

            if (resultado.isConfirmed) {
                try {
                    const response = await fetch("http://localhost:3000/comentarios");
                    if (!response.ok) {
                        throw new Error(
                            "Error al obtener los comentarios: " + response.statusText
                        );
                    }

                    const comentarios = await response.json();
                    const comentarioEncontrado = comentarios.find(
                        (c) => c.id === comentario.id
                    );

                    if (comentarioEncontrado) {
                        await fetch(
                            `http://localhost:3000/comentarios/${comentarioEncontrado.id}`,
                            {
                                // URL interpolada correctamente
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        this.mostrarAlerta(
                            "Aviso",
                            "Comentario eliminado correctamente",
                            "success"
                        );
                        this.getComentarios();

                    } else {
                        this.mostrarAlerta(
                            "Error",
                            "Comentario no encontrado en el servidor",
                            "error"
                        );
                    }
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta(
                        "Error",
                        "No se pudo cargar el comentario desde el servidor.",
                        "error"
                    );
                }
            }
        },
    },
};
</script>

<style>
.star-valor {
    font-size: 2rem;
    /* TamaÃ±o de las estrellas */
    color: rgb(19, 98, 189);
    /* Color dorado */
    cursor: pointer;
}

.star-icon {
    margin-right: 5px;
}
</style>
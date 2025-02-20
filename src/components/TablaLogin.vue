<template>
    <div>
        <div class="text-center my-4">
            <h5 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block">
                <i class="bi bi-people-fill me-2"></i> <!-- Icono decorativo -->
                Iniciar sesión
                <span class="underline-effect"></span> <!-- Línea decorativa -->
                <router-link to="/" class="btn btn-customb"> <i class="bi bi-arrow-return-left me-2"></i></router-link>
            </h5>
        </div>

        <div class="container-fluid border p-5">
            <form @submit.prevent="iniciarSesion" class="p-4 border rounded shadow-sm bg-light w-50 mx-auto">
                <!-- Campo DNI -->
                <div class="mb-3">
                    <label for="dni" class="form-label">DNI:</label>
                    <input type="text" id="dni" class="form-control" v-model="dni" required />
                </div>

                <!-- Campo Contraseña -->
                <div class="mb-3">
                    <label for="pass" class="form-label">Contraseña:</label>
                    <input type="password" id="pass" class="form-control" v-model="pass" required />
                </div>

                <!-- Botón de login -->
                <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                </div>
            </form>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { verificarContrasena } from '../config/passport.mjs';

export default {
    name: "TablaLogin",
    components: {

    },
    data() {
        return {
            dni: "",
            pass: "",
            errorMessage: "",
            usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
        };
    },

    created() {
        // Cargar los usuarios desde el archivo datos.json al crear el componente
        this.getUsuarios();
    },

    methods: {

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Obtener y ordenar usuarios por apellidos y luego por nombre
                this.usuarios = (await response.json()).sort((a, b) =>
                    a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
                );

            } catch (error) {
                console.error(error);
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

        async iniciarSesion() {
            // Buscar el usuario con el DNI proporcionado
            const usuario = this.usuarios.find((user) => user.dni === this.dni);

            // Verificar si el usuario existe
            if (usuario) {
                // Verificar la contraseña usando passport para compararla con la encriptada
                const contrasenaCorrecta = await verificarContrasena(
                    this.pass,
                    usuario.pass
                );

                if (contrasenaCorrecta) {
                    if (usuario.tipo === "admin") {
                        this.errorMessage = ""; // Limpiar mensaje de error
                        this.mostrarAlerta("Bienvenido", "Sesión Iniciada", "success");
                        localStorage.setItem('isLogueado', 'true');
                        localStorage.setItem('isAdmin', 'true');
                        localStorage.setItem("dni", usuario.dni)
                        this.$router.push({ name: 'inicio' }).then(() => {
                            window.location.reload(); // Recargar la página
                        });
                    } else {
                        this.errorMessage = ""; // Limpiar mensaje de error
                        this.mostrarAlerta("Bienvenido", "Sesión Iniciada", "success");
                        localStorage.setItem('isLogueado', 'true');
                        localStorage.setItem('isAdmin', 'false');
                        localStorage.setItem("dni", usuario.dni)

                        this.$router.push({ name: 'comentarios' }).then(() => {
                            window.location.reload(); // Recargar la página
                        }); // Redirigir a una ruta para usuarios normales
                    }

                }

            } else {
                this.errorMessage = "DNI o contraseña incorrectos. Inténtalo de nuevo.";
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin-top: 50px;
}
</style>
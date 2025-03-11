<template>
   <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-4 w-50">
        <div class="text-center mb-4">
            <h5 class="fw-bold text-uppercase text-primary position-relative d-inline-block">
                <i class="bi bi-people-fill me-2"></i> Iniciar sesión
                <span class="underline-effect"></span>
            </h5>
            <router-link to="/" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-return-left me-1"></i> Volver
            </router-link>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="iniciarSesion" class="bg-light p-4 rounded shadow-sm">
            <!-- Campo DNI -->
            <div class="mb-3">
                <label for="dni" class="form-label fw-bold">DNI:</label>
                <input type="text" id="dni" class="form-control input-style" v-model="dni" required />
            </div>

            <!-- Campo Contraseña -->
            <div class="mb-3">
                <label for="pass" class="form-label fw-bold">Contraseña:</label>
                <input type="password" id="pass" class="form-control input-style" v-model="pass" required />
            </div>

            <!-- Botón de login -->
            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">Iniciar sesión</button>
            </div>
        </form>

        <!-- Credenciales de prueba -->
        <div class="mt-4 p-3 bg-light rounded shadow-sm">
            <h5 class="fw-bold text-center text-secondary">Usuarios de prueba</h5>
            <div class="row">
                <div class="col-md-6">
                    <h6 class="fw-bold text-primary">Usuario Normal:</h6>
                    <p class="mb-1"><strong>DNI:</strong> y9654813w</p>
                    <p><strong>Contraseña:</strong> renaido</p>
                </div>
                <div class="col-md-6">
                    <h6 class="fw-bold text-danger">Administrador:</h6>
                    <p class="mb-1"><strong>DNI:</strong> 53974821P</p>
                    <p><strong>Contraseña:</strong> estebomba</p>
                </div>
            </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
            {{ errorMessage }}
        </div>
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
    max-width: 1200px;
}
.input-style:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
    }
</style>
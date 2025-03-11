<template>
    <div class="container mt-5">
        <div class="card shadow-lg">
            <div class="card-body">
                <h2 class="text-center mb-4">Contáctanos</h2>
                <form @submit.prevent="enviarCorreo">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" v-model="contacto.nombre" class="form-control form-control-lg" id="nombre"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="tel" v-model="contacto.telefono" class="form-control form-control-lg" id="telefono"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" v-model="contacto.email" class="form-control form-control-lg" id="email"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="mensaje" class="form-label">Mensaje</label>
                        <textarea v-model="contacto.mensaje" class="form-control form-control-lg" id="mensaje" rows="4"
                            required></textarea>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Enviar Mensaje</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: 'TablaContacto',
    data() {
        return {
            contacto: {
                nombre: '',
                telefono: '',
                email: '',
                mensaje: ''
            },

        };
    },
    computed: {

    },
    methods: {
        enviarCorreo() {
            fetch('http://localhost:5000/enviar-correo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.contacto),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        this.mensajeExito = 'Mensaje enviado con éxito!';
                        // Optional: Reseteamos el formulario
                        this.contacto.nombre = '';
                        this.contacto.telefono = '';
                        this.contacto.email = '';
                        this.contacto.mensaje = '';
                        Swal.fire({
                            icon: 'success',
                            title: "Mensaje Enviado con Éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        this.mensajeError = 'Hubo un problema al enviar el mensaje. Intenta de nuevo.';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.mensajeError = 'Hubo un error en la conexión con el servidor. Intenta nuevamente.';
                });
        }
    }
};

</script>

<style scoped>
asda .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
}

.invalid-feedback {
    color: #dc3545;
}

.border {
    border: 1px solid #dee2e6 !important;
}

.rounded {
    border-radius: 0.25rem !important;
}

.shadow-sm {
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
}
</style>
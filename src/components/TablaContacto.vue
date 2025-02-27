<template>
    <div>
        <h3 class="text-center front-weight-bold mt-4 text-primary" id="titulo">
            <i class="bi bi-person-rolodex"></i> PÁGINA DE CONTACTO
        </h3>
        <div class="container mt-5">
            <form @submit.prevent="enviarCorreo" class="border p-4 rounded shadow-sm">
                <div class="form-group mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" id="nombre" v-model="contacto.nombre" @blur="nombreTocado = true" class="form-control" :class="{'is-invalid': nombreTocado && !esNombreValido}">
                    <div class="invalid-feedback" v-if="nombreTocado && !esNombreValido">El nombre es obligatorio.</div>
                </div>
                <div class="form-group mb-3">
                    <label for="telefono" class="form-label">Teléfono:</label>
                    <input type="text" id="telefono" v-model="contacto.telefono" @blur="telefonoTocado = true" class="form-control" :class="{'is-invalid': telefonoTocado && !esTelefonoValido}">
                    <div class="invalid-feedback" v-if="telefonoTocado && !esTelefonoValido">El teléfono debe ser válido.</div>
                </div>
                <div class="form-group mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input type="email" id="email" v-model="contacto.email" @blur="emailTocado = true" class="form-control" :class="{'is-invalid': emailTocado && !esEmailValido}">
                    <div class="invalid-feedback" v-if="emailTocado && !esEmailValido">El email debe ser válido.</div>
                </div>
                <div class="form-group mb-3">
                    <label for="mensaje" class="form-label">Mensaje:</label>
                    <textarea id="mensaje" v-model="contacto.mensaje" class="form-control" rows="4"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
    </div>
</template>

<script>
import emailjs from 'emailjs-com';

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
            nombreTocado: false,
            telefonoTocado: false,
            emailTocado: false
        };
    },
    computed: {
        esNombreValido() {
            return this.contacto.nombre.trim() !== '';
        },
        esTelefonoValido() {
            const regexTelefono = /^[67]\d{8}$/;
            return regexTelefono.test(this.contacto.telefono);
        },
        esEmailValido() {
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regexEmail.test(this.contacto.email);
        }
    },
    methods: {
        enviarCorreo() {
            if (this.esNombreValido && this.esTelefonoValido && this.esEmailValido) {
                const templateParams = {
                    nombre: this.contacto.nombre,
                    telefono: this.contacto.telefono,
                    email: this.contacto.email,
                    mensaje: this.contacto.mensaje
                };

                emailjs.send(
                    'service_we7lelf',  // ID del servicio
                    'template_l2b5qe1',  // ID de la plantilla
                    templateParams,
                    'XJ_mNfRae3GGAzOhm'  // ID de usuario de EmailJS
                )
                    .then((response) => {
                        console.log('Correo enviado exitosamente', response);
                        alert('Tu mensaje ha sido enviado con éxito.');
                    })
                    .catch((error) => {
                        console.error('Error al enviar correo:', error);
                        alert('Hubo un error al enviar el mensaje. Intenta de nuevo más tarde.');
                    });
            } else {
                alert('Por favor, completa todos los campos correctamente.');
            }
        }
    }
};

</script>

<style scoped>
.form-control:focus {
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
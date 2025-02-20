<template>
    <div>

        <h3 class="mt-3 text-center front-weight-bold"><i class="bi bi-people"></i> REGISTRO <router-link to="/">
                <button class="btn btn-customb"><i class="bi bi-arrow-return-left "></i></button></router-link></h3>

    </div>
    <br>
    <div class="container-fluid border p-4">
        <form class="form-in-line">
            <div class="col-10 col-m-6 col-lg-8 mx-auto">
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">DNI/NIE:</span>
                    <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="usuario.dni"
                        @blur="validarDNI(this.usuario.dni)" :disabled="editDni">



                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Apellidos: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="usuario.apellidos">
                    <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="usuario.nombre">
                </div>

                <div class="input-group-text mb-3">

                    <span class="input-group-text custom-span  me-2">Email: </span>
                    <input type="email" class="form-control sm w-50" placeholder="Correo electrónico"
                        v-model="usuario.email">

                    <span class="input-group-text custom-span ms-2 me-2">Repetir Email: </span>
                    <input type="email" class="form-control sm w-50" placeholder="Repite el correo electrónico"
                        v-model="emailRepetido" @blur="comprobarEmail(emailRepetido)">

                    <span class="input-group-text custom-span me-2 ms-2">Movil:</span>
                    <input class="form-control sm w-25" type="text" v-model="usuario.telefono"
                        @blur="validarTelefono(this.usuario.telefono)" placeholder="Móvil usuario">
                </div>

                <div class="input-group-text mb-3">

                    <span class="input-group-text custom-span  me-2">Contraseña: </span>
                    <input type="password" :class="{'error-border' : passMissmatch}" class="form-control sm w-50" placeholder="Introduce la contraseña"
                        v-model="usuario.pass">

                    <span class="input-group-text custom-span ms-2 me-2">Repetir contraseña: </span>
                    <input type="password" :class="{'error-border' : passMissmatch}" class="form-control sm w-50" placeholder="Repite la contraseña"
                        v-model="pass2" @blur="comprobarContraseña(this.pass2)">


                </div>

                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Dirección: </span>
                    <input type="text" class="form-control sm w-100" placeholder="Dirección"
                        v-model="usuario.direccion">
                </div>
                <div class="input-group-text mb-3">

                    <span class="input-group-text custom-span me-2 ">Provincia: </span>
                    <select name="provincia" class="form-control sm " v-model="usuario.provincia">
                        <option value="">Provincia</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia">
                            {{ provincia.nm }}
                        </option>
                    </select>
                    <span class="input-group-text custom-span ms-2 me-2">Municipio: </span>
                    <select name="municipio" class="form-control sm w-100" v-model="usuario.municipio">
                        <option value="">Municipio</option>
                        <option v-for="municipio in municipiosFiltrados" :key="municipio.id" :value="municipio">
                            {{ municipio.nm }}
                        </option>
                    </select>

                    <button class="btn btn-light m-1" @click="limpiarFormCli()">
                        <i class="bi-arrow-clockwise"></i>
                    </button>


                </div>
                <input type="checkbox" class="text-align-left" name="" id="" v-model="this.lopd" required> He
                leido y
                acepto la <router-link to="/privacidad">Politica de privacidad</router-link> <br>
            </div>
            <button class="btn btn-primary m-1" @click.prevent="grabarUsuario">Enviar</button>

        </form>
    </div>



</template>

<script>
import Swal from 'sweetalert2';
import {encriptarContrasena} from '../config/passport.mjs';

export default {
    name: "TablaUsuarios",
    components: {
    },

    data() {
        return {

            usuario: {
                dni: '',
                alta: '',
                apellidos: '',
                nombre: '',
                direccion: '',
                email: '',
                pass: '',
                provincia: '',
                municipio: '',
                baja: '',
                telefono: '',
                tipo: 'usuario',
            },
            lopd: false,
            emailRepetido: '',
            provincias: [],
            municipios: [],
            errores: [],
            isChecked: false,
            editDni: false,
            pass2: '',
        };
    },

    mounted() {
        this.getProvincias();
        this.getMunicipios();
    },


    computed: {

        municipiosFiltrados() {
            if (!this.usuario.provincia || !this.usuario.provincia.id) return [];

            return this.municipios.filter(municipio =>
                municipio.id.startsWith(this.usuario.provincia.id)
            )
        },

        passMissmatch() {
            return this.usuario.pass !== this.pass2;
        }
    },

    methods: {

        validarEmail(email) {
            if (email == '') {
                this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
            }
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email)) {
                this.mostrarAlerta('Error', 'El email con formato no valido', 'error')
            }
        },


        async seleccionaUsuario(usuario) {
            try {
                this.limpiarFormCli()
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                const usuarios = await response.json();

                // Encontrar el usuario por su DNI
                const usuarioEncontrado = usuarios.find(c => c.dni === usuario.dni);


                if (usuarioEncontrado) {
                    // Convertir la fecha de alta al formato dd/mm/yyyy
                    // Asignar el objeto completo de provincia y municipio
                    if (this.usuario.provincia) {
                        this.usuario.provincia = this.provincias.find(p => p.nm === this.usuario.provincia).nm;
                        if (this.usuario.provincia) {
                            console.log("Provincia encontrada", this.usuario.provincia);

                        }
                    }

                    this.usuario = { ...usuarioEncontrado };
                    this.editDni = true;
                    console.log("usuario encontrado", this.usuario.municipio);
                    if (this.usuario.alta) {
                        this.usuario.alta = this.usuario.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
                    }
                } else {
                    this.mostrarAlerta('Error', 'usuario no encontrado en el servidor.', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
            }
        },


        limpiarFormCli() {
            this.usuario = {
                dni: '',
                alta: '',
                apellidos: '',
                nombre: '',
                direccion: '',
                email: '',
                provincia: '',
                municipio: '',
                baja: '',
                pass: ''
            }
            this.emailRepetido = '';
            this.editDni = false;
            this.pass2 = '';
        },

        validarDNI(dni) {
            if (dni === '') {
                // Si el campo está vacío, no hace nada
                return true;
            }
            dni = dni.toUpperCase(); // Convertir a mayúsculas
            this.usuario.dni = dni;
            // Comprobar el formato del DNI/NIE
            const dniRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/; // Formato 8 dígitos seguido de 1 letra

            if (!dniRegex.test(dni)) {
                this.mostrarAlerta('Error', 'El NIE/DNI con formato no válido.', 'error');
                return false;
            }

            // Inicializar variables para el cálculo
            let dniNum = dni.substring(0, 8); // Extraer los númerhttp://localhost:3000/provinciasos
            const letra = dni.charAt(8); // Obtener la letra en la posición 8
            // Identificación del NIE y sustitución
            if (dniNum.charAt(0) === 'X') {
                dniNum = dniNum.substring(1, 8)
                dniNum = '0' + dniNum; // Sustituir X por 0
            } else if (dniNum.charAt(0) === 'Y') {
                dniNum = dniNum.substring(1, 8)
                dniNum = '1' + dniNum; // Sustituir Y por 1
            } else if (dni.charAt(0) === 'Z') {
                dniNum = dniNum.substring(1, 8)
                dniNum = '2' + dniNum; // Sustituir Z por 2
            }

            // Comprobar la letra esperada
            const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'; // Letras válidas para el DNI
            const letraCalculada = letras[dniNum % 23]; // Calcular la letra esperada
            if (letra !== letraCalculada) {
                this.mostrarAlerta('Error', 'DNI/NIE Incorrecto.', 'error');
                return false;
            }

            return true; // DNI/NIE válido

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



        async getProvincias() {
            try {
                const response = await fetch('http://localhost:3000/provincias');
                if (!response.ok) {
                    throw new Error('Error en la solicitud:' + response.statusText);
                }
                this.provincias = await response.json();
            } catch (error) {
                console.error(error);
            }
        },

        async getMunicipios() {
            try {
                const response = await fetch('http://localhost:3000/municipios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud:' + response.statusText);
                }
                this.municipios = await response.json();
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
                    container: 'custom-alert-container',
                    popup: 'custom-alert-popup',
                    modal: 'custom-alert-modal'
                }
            })
        },
        obtenerFechaHoy() {
            const fecha = new Date();
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        comprobarEmail(email) {
            if (this.usuario.email === email) {
                return true
            } else {
                this.mostrarAlerta('Aviso', 'Email diferente al introducido', 'error');
                return false
            }
        },
        comprobarContraseña(pass){
            if (this.usuario.pass === pass) {
                return true
            } else {
                this.mostrarAlerta('Aviso', 'Contraseña diferente al introducido', 'error');
                return false
            }
        },

        async grabarUsuario() {
            const resultado = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas registrarte?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Grabar',
                cancelButtonText: 'No, no grabar',
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
            })

            if (resultado.isConfirmed) {
                // Verificar si los campos requeridos están llenos
                if (this.usuario.dni && this.usuario.apellidos && this.usuario.telefono && this.usuario.email && this.usuario.provincia && this.usuario.municipio && this.lopd) {
                    try {

                        if (!this.comprobarEmail(this.emailRepetido)) {
                            this.mostrarAlerta('Aviso', 'Email repetido incorrecto', 'error');
                        
                        } else if (!this.comprobarContraseña(this.pass2)) {
                            this.mostrarAlerta('Aviso', 'Contraseña repetida incorrecta', 'error');
                        } else {
                            this.usuario.baja = '';
                            this.encriptarContrasenas(this.usuario.pass);

                            // Obtener los usuarios existentes
                            const response = await fetch('http://localhost:3000/usuarios');
                            if (!response.ok) {
                                throw new Error('Error al obtener los usuarios: ' + response.statusText);
                            }

                            const usuariosExistentes = await response.json();

                            const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);
                            if (usuarioExistente && usuarioExistente.baja === '') {
                                this.mostrarAlerta('Error', 'El usuario ya existe con este DNI', 'error');
                            }
                            else if (usuarioExistente && usuarioExistente.baja !== '') {

                                this.mostrarAlerta('Aviso', 'Habla con el administrador', 'error');
                            } else {
                                this.usuario.alta = this.obtenerFechaHoy()
                                const crearResponse = await fetch('http://localhost:3000/usuarios', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(this.usuario),
                                });
                                this.limpiarFormCli();
                                if (!crearResponse.ok) {
                                    throw new Error('Error al guardar el usuario: ' + crearResponse.statusText);
                                }

                                this.mostrarAlerta('Aviso', 'usuario grabado correctamente', 'success');
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        this.mostrarAlerta('Error', 'No se pudo grabar el usuario.', 'error');
                    }
                } else {
                    this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
                }
            }
        },

        async encriptarContrasenas(pass){
            const passEncriptada = await encriptarContrasena(pass);
            console.log('Contraseña encriptada:', passEncriptada);
            this.usuario.pass = passEncriptada;
        }


    },
}

</script>

<style scoped>
.custom-date-input {
    width: 12em;
    text-align: center;
}
</style>
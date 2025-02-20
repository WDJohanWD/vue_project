<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary w-100">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/inicio" class="nav-link text-white" exact-active-class="active">Inicio</router-link>
                    </li>
                    <li v-if="isAdmin" class="nav-item">
                        <router-link to="/" class="nav-link text-white" exact-active-class="active">Gestión</router-link>
                    </li>
                    <li v-if="isAdmin" class="nav-item">
                        <router-link to="/usuarios" class="nav-link text-white"
                            exact-active-class="active">Usuarios</router-link>
                    </li>
                    <li  class="nav-item">
                        <router-link to="/empleo" class="nav-link text-white"
                            exact-active-class="active">Empleo</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/comentarios" class="nav-link text-white"
                            exact-active-class="active">Comentarios</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/contacto" class="nav-link text-white"
                            exact-active-class="active">Contacto</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/articulos" class="nav-link text-white"
                            exact-active-class="active">Articulos</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/tienda" class="nav-link text-white"
                            exact-active-class="active">Tienda</router-link>
                    </li>
                </ul>
                <input class="form-control w-25 ms-auto" type="search" placeholder="Buscar" aria-label="Search">
                <button class="btn btn-outline-success bg-light" type="submit"> <i class="bi bi-search"></i></button>

                <span v-if="isLogged" class="navbar-text text-white ms-3">{{ nombreUsuario }}</span>
                <div class="dropdown">
                    <button class="dropdown-toggle  ms-4 me-2" type="button" id="dropdownMenuButton"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-bounding-box fs-2"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end fs-5" aria-labelledby="dropdownMenuButton">
                        <li v-if="!isLogged" ><router-link class="nav-link text-primary text-end me-3" to="/login"
                                href="#">Acceder</router-link></li>
                        <li><router-link class="nav-link text-primary text-end me-3" to="/registro"
                                href="#">Registro</router-link></li>
                        <li>
                            <a class="nav-link text-primary text-end me-3" v-if="isLogged" @click.prevent="logout">Cerrar sesión</a>
                        </li>


                    </ul>
                </div>

            </div>
        </div>
    </nav>
    <router-view />
</template>

<script>
export default {
    name: "NavBar",
    data() {
        return {
            isDropdownVisible: false,
            isAdmin: false,
            isLogged: false,
            dniUsuario: '',
            nombreUsuario: '',
            usuarios: []
        };
    },

    async mounted() {
        // Comprobar si el usuario está logueado al montar el componente
        await this.getUsuarios();
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogged = localStorage.getItem('isLogueado') === 'true';
        this.dniUsuario = localStorage.getItem('dni');
        this.obtenerNombre(this.dniUsuario);
    },
    methods: {
        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Obtener y ordenar usuarios por apellidos y luego por nombre
                this.usuarios = await response.json();

            } catch (error) {
                console.error(error);
            }
        },

        async obtenerNombre(dni) {
            const usuario = this.usuarios.find((user) => user.dni === dni);
            if (usuario) {
                this.nombreUsuario = usuario.nombre;
            } else {
                console.error('Usuario no encontrado');
                this.nombreUsuario = '';
            }
        },

        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        logout() {
            // Eliminar los datos de sesión del localStorage
            localStorage.removeItem('isLogueado');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('dni');
            window.location.reload();
            this.$router.push({ name: 'login' }).catch(err => {
                console.error(err); // Captura y logea errores para debugging
            });
        },


    },
};
</script>

<style scoped>
/* Cambiar el color de la clase active */
.nav-link.active {
    color: #FAD02E !important;
    font-size: 1.1rem;
    transition: font-size 0.5s ease;
}

/* Quitar el fondo y bordes del botón */
.dropdown-toggle {
    background-color: transparent;
    border: none;
    color: var(--bs-white);
    /* Color primario de Bootstrap */
}

/* Quitar el fondo del botón al hacer clic o enfocarlo */
.dropdown-toggle:focus,
.dropdown-toggle:active {
    box-shadow: none;
}
</style>
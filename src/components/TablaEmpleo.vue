<template>
  <div>
    <h3 class="mt-3 text-center front-weight-bold"><i class="bi bi-person-workspace"></i> TRABAJA CON NOSOTROS
      <router-link to="/">
        <button class="btn btn-customb"><i class="bi bi-arrow-return-left "></i></button></router-link>
    </h3>
  </div>
  <br>
  <div class="container-fluid border p-4">
    <form class="form-in-line">
      <div class="col-10 col-m-6 col-lg-6 mx-auto">
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Apellidos:</span>
          <input type="text" class="form-control sm w-50" required placeholder="Apellidos"
            v-model="candidato.apellidos">

          <span class="input-group-text custom-span ms-2 me-2">Nombre:</span>
          <input type="text" class="form-control sm w-50" required placeholder="Nombre" v-model="candidato.nombre">
        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Email: </span>
          <input type="email" class="form-control sm w-50" required placeholder="Email" v-model="candidato.email"
            @blur="validarEmail(this.candidato.email)">

          <span class="input-group-text custom-span ms-2 me-2">Móvil:</span>
          <input class="form-control sm w-25" type="text" required placeholder="Móvil" v-model="candidato.movil"
            @blur="validarTelefono(this.candidato.movil)" :disabled="editMovil">



        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Departamentos</span>
          <select name="departamento" class="form-control sm w-25 ms-2" v-model="candidato.departamento" required>
            <option value="" disabled>Departamentos</option>
            <option v-for="departamento in departamentos" :key="departamento.id" :value="departamento">
              {{ departamento.nm }}
            </option>
          </select>

          <span class="input-group-text custom-span ms-2 me-2">Modalidades </span>
          <div class="m-auto">
            <input class="mx-2" type="radio" name="modalidad" v-model="candidato.modalidad" value="remoto"
              id="remoto"><label for="remoto">Remoto</label>
            <input class="mx-2" type="radio" name="modalidad" v-model="candidato.modalidad" value="hibrido"
              id="hibrido"><label for="hibrido">Hibrido</label>

            <input class="mx-2" type="radio" name="modalidad" v-model="candidato.modalidad" value="presencial"
              id="presencial"><label for="presencial">Presencial</label>

          </div>

        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span  me-2" for="comentario">Comentario: </span>
          <textarea placeholder="Comentarios (Máximo 256 caracteres)" class="form-control sm w-100" maxlength="256"
            name="" id="" rows="4" v-model="candidato.comentario"
            @blur="validarComentario(this.candidato.comentario)"></textarea>

        </div>
        <div class="input-group-text mb-3">

          <span class="input-group-text custom-span  me-2">CV (PDF) </span>
          <input type="file" class="custom-file-input form-control" placeholder="Seleccionar un archivo (SOLO PDF)"
            accept=".pdf" @change="handleFileChange" ref="fileInput">

        </div>
        <input type="checkbox" class="text-align-left" name="" id="" v-model="candidato.avisoLegal" required> He leido y
        acepto la <router-link to="/privacidad">Politica de privacidad</router-link>

      </div>
      <button class="btn btn-primary m-1" @click.prevent="grabarCandidato"
        :disabled="!candidato.avisoLegal">Enviar</button>
    </form>
  </div>


  <div v-if="isAdmin">
    <div class="container my-5">
      <h4 class="mb-4"><i class="bi bi-pencil-square"></i> Gestionar candidatos</h4>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-10">Apellidos</th>
                <th scope="col" class="w-10">Nombre</th>
                <th scope="col" class="w-10">Móvil</th>
                <th scope="col" class="w-10">Departamento</th>
                <th scope="col" class="w-10 text-center">Modalidad</th>
                <th scope="col" class="pale-yellow table-warning">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidato in candidatosPorPagina" :key="candidato.id">
                <td class="align-middle ">{{ candidato.apellidos }}</td>
                <td class="align-middle">{{ candidato.nombre }}</td>
                <td class="align-middle">{{ candidato.movil }}</td>
                <td class="align-middle">{{ candidato.departamento }}</td>

                <td class="align-middle">{{ candidato.modalidad }}</td>
                <td class="text-center align-middle pale-yellow table-warning">
                  <div>
                    <button class="btn btn-warning m-2" @click="seleccionaCandidato(candidato)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>

                    <button class="btn btn-danger m-2" @click="deleteCandidato(candidato.movil)">
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

            <button class="btn btn-primary" :disabled="currentPage * pageSize >= candidatos.length"
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

export default {
  name: "TablaEmpleo",
  components: {
  },

  data() {
    return {
      candidato: {
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        departamento: '',
        modalidad: '',
        avisoLegal: '',
        comentario: ''
      },
      cvFile: null,
      isAdmin: false,
      candidatos: [],
      departamentos: [],
      editMovil: false,
      currentPage: 1,
      pageSize: 5
    }
  },

  mounted() {
    this.getCandidatos();
    this.getDepartamentos();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  },
  computed: {

    candidatosPorPagina() {
      const inicio = (this.currentPage - 1) * this.pageSize;
      return this.candidatos.slice(inicio, inicio + this.pageSize);

    },

  },
  methods: {
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.candidatos.length) {
        this.currentPage++;
      }
    },
    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    handleFileChange(event) {
      this.cvFile = event.target.files[0];
      console.log(this.cvFile);
    },

    async grabarCandidato() {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas grabar el candidato?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Grabar',
        cancelButtonText: 'No, no grabar',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
      });

      if (resultado.isConfirmed) {
        if (
          this.candidato.apellidos &&
          this.candidato.nombre &&
          this.candidato.email &&
          this.candidato.movil &&
          this.candidato.departamento &&
          this.candidato.modalidad
        ) {
          try {
            // Validaciones
            if (!this.candidato.apellidos || !this.candidato.nombre || !this.candidato.email || !this.candidato.movil
              || !this.candidato.departamento || !this.candidato.modalidad) {
              this.mostrarAlerta("Aviso", "Todos los campos obligatorios", "warning");
              return; // Detiene la ejecución si falta algún campo
            }

            

            // **Paso 1: Enviar los datos del candidato**
            const datos = {
              apellidos: this.candidato.apellidos,
              nombre: this.candidato.nombre,
              email: this.candidato.email,
              movil: this.candidato.movil,
              departamento: this.candidato.departamento.nm,
              modalidad: this.candidato.modalidad,
              comentarios: this.candidato.comentarios,
              avisolegal: "si"
            };

            const responseCandidato = await fetch('http://localhost:3000/candidatos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datos), // Enviamos los datos como JSON
            });

            if (!responseCandidato.ok) {
              const errorData = await responseCandidato.json();
              throw new Error(`Error al guardar los datos del candidato: ${errorData.message || 'Desconocido'}`);
            }

            // Paso 2: Subir el archivo PDF (si existe)
         
            if (this.cvFile) {

              const formData = new FormData();
              const candidatoId = this.candidato.movil;
              console.log('Candidato ID:', this.candidato.movil);
              if (!candidatoId) {
                throw new Error('No se pudo obtener el ID del candidato');
              }
              const nuevoArchivo = new File([this.cvFile], `${candidatoId}.pdf`, { type: this.cvFile.type });
              formData.append('archivo', nuevoArchivo);
              formData.append('candidatoId', candidatoId) 
              console.log(nuevoArchivo)
              const fileResponse = await fetch('http://localhost:5000/subircv', {
                method: 'POST',
                body: formData,
                credentials : 'include'
              });
            
              if (!fileResponse.ok) {
                throw new Error('Error al subir el archivo');
              }else{
                console.log('hubo respuesta:', fileResponse);
              }


              const fileData = await fileResponse.json();
              console.log('Archivo subido correctamente:', fileData);
            }
            // Si todo fue bien
            this.mostrarAlerta("Aviso", "Datos y archivo enviados correctamente", "success");
            this.getCandidatos(); // Si necesitas actualizar la lista de candidatos

            // Restablecer formulario
            this.candidato = {
              apellidos: '',
              nombre: '',
              email: '',
              movil: '',
              categoria: '',
              modalidad: '',
              comentarios: '',
            };
            this.$refs.fileInput.value = null;
            this.isChecked = false; }
            catch (error) {
            console.error('Error:', error);
            //this.mostrarAlerta("Error", error.message, "error");  // Mostrar el error en la alerta
          }
        } else if (this.candidato.avisoLegal === false) {
          this.mostrarAlerta('Error', 'Por favor, acepta las Políticas de Privacidad.', 'error');
        } else {
          this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
        }
      }
    },

    limpiarCampos() {
      // Limpiar los campos del formulario
      this.candidato.apellidos = '';
      this.candidato.nombre = '';
      this.candidato.email = '';
      this.candidato.movil = '';
      this.candidato.departamento = '';
      this.candidato.modalidad = '';
      this.candidato.avisoLegal = '';
      this.candidato.comentario = '';
      this.cvFile = null;

      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'info',
        title: 'Campos limpiados',
        text: 'Los campos del formulario se han limpiado correctamente.',
      });
    },



    async seleccionaCandidato(candidato) {
      try {
        this.limpiarFormulario()
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const candidatos = await response.json();

        // Encontrar el candidato por su DNI
        const candidatoEncontrado = candidatos.find(c => c.movil === candidato.movil);


        if (candidatoEncontrado) {
          this.editMovil = true;
          this.candidato = { ...candidatoEncontrado };
        } else {
          this.mostrarAlerta('Error', 'candidato no encontrado en el servidor.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
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

    validarEmail(email) {
      if (email == '') {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
      }
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(email)) {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error')
      }
    },

    validarComentario(comentario) {
      if (comentario.length > 256) {
        this.mostrarAlerta('Error', 'el comentario no puede sobre pasar 256 caracteres', 'error')
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

    limpiarFormulario() {
      this.candidato = {
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        departamento: '',
        modalidad: '',
        avisoLegal: '',
        comentario: ''
      }
      this.editMovil = false;
    },



    async getDepartamentos() {
      try {
        const response = await fetch('http://localhost:3000/departamentos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.departamentos = await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    async getCandidatos() {
      try {
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.candidatos = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
      } catch (error) {
        console.error(error);
      }
    },

    async deleteCandidato(movil) {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar el candidato?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
      })

      if (resultado.isConfirmed) {
        try {

          const response = await fetch("http://localhost:3000/candidatos");
          if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
          }

          const candidatos = await response.json();
          const candidatoExistente = candidatos.find(candidato => candidato.movil === movil);

          if (candidatoExistente) {

            await fetch(`http://localhost:3000/candidatos/${candidatoExistente.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });

            this.mostrarAlerta("Aviso", "candidato dado de baja correctamente", "success");
            this.getCandidatos();

          } else {
            this.mostrarAlerta("Error", "candidato no encontrado", "error");
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta("Error", "No se pudo dar de baja al candidato", "error");
        }
      }
    }
  }
}
</script>

<style></style>
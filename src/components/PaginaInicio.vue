<template>
  <div class="container mt-4">
    <div class="text-center mb-4">
      <h1>Bienvenido a la Página de Inicio</h1>
      <p>Esta es la página principal de nuestra aplicación.</p>
    </div>

    <div id="carouselInicio" class="carousel slide shadow-lg" data-bs-ride="carousel" data-bs-interval="3000">
      <!-- Indicadores -->
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselInicio" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#carouselInicio" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#carouselInicio" data-bs-slide-to="2"></button>
      </div>

      <!-- Imágenes del Carrusel -->
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/inicio1.png" class="d-block w-100 img-carousel" alt="Imagen 1">
        </div>
        <div class="carousel-item">
          <img src="../assets/inicio2.jpg" class="d-block w-100 img-carousel" alt="Imagen 2">
        </div>
        <div class="carousel-item">
          <img src="../assets/inicio3.jpg" class="d-block w-100 img-carousel" alt="Imagen 3">
        </div>
      </div>

      <!-- Controles del Carrusel -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselInicio" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselInicio" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  </div>


</template>

<script>
export default {
  name: 'PaginaInicio'
}
</script>

<style scoped>
.img-carousel {
  height: 500px;
  /* Ajusta según necesites */
  object-fit: cover;
  /* Recorta la imagen sin deformarla */
}

.pagina-inicio {
  text-align: center;
  margin-top: 50px;
}

.pagina-inicio h1 {
  font-size: 2em;
  color: #333;
}

.pagina-inicio p {
  font-size: 1.2em;
  color: #666;
}
</style>
<template>
    <div class="cancel-page">
        <h1>Pago Cancelado</h1>
        <p>Lo sentimos, tu pago ha sido cancelado.</p>
        <router-link to="/">Volver a la página principal</router-link>
    </div>
</template>

<script>
export default {
    name: 'PáginaCancel'
}
</script>

<style scoped>
.cancel-page {
    text-align: center;
    margin-top: 50px;
}

.cancel-page h1 {
    color: red;
}

.cancel-page p {
    margin: 20px 0;
}

.cancel-page a {
    color: blue;
    text-decoration: underline;
}
</style>
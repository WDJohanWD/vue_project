<template>
    <div class="payment-success">
        <h1>Pago Completado</h1>
        <p>¡Gracias por tu compra! Tu pago ha sido procesado exitosamente.</p>
    </div>
</template>

<script>
export default {
    name: 'PaginaSucess'
}
</script>

<style scoped>
.payment-success {
    text-align: center;
    margin-top: 50px;
}

.payment-success h1 {
    color: #4CAF50;
}

.payment-success p {
    font-size: 18px;
}
</style>
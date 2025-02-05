<template>
    <div class="tabla-tienda">
        <h1>Tabla Tienda</h1>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Producto 1</td>
                    <td>$10</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>Producto 2</td>
                    <td>$20</td>
                    <td>3</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'TablaTienda',
};
</script>

<style scoped>
.tabla-tienda {
    font-family: Arial, sans-serif;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}
</style>
<script>
</script>
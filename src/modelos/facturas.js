import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    id: { type: String, required: true }, // Referencia al artículo
    precio_unitario: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 } // Precio unitario * cantidad
});


const facturaSchema = new mongoose.Schema(
    {
        items: [itemSchema], // Array de ítems
        totalFactura: { type: Number, required: true, min: 0 },
        fecha: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

const Factura = mongoose.model('Factura', facturaSchema);
export default Factura;
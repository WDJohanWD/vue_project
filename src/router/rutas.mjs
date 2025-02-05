import express from 'express';
import Articulo from '../modelos/modelos.js';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const rutas = express.Router();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Configuración de multer
// Función para crear la configuración de almacenamiento (storage)
const createStorage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folder);  // Se define la carpeta de destino dinámicamente
    },
    filename: function (req, file, cb) {
        //const candidatoId = req.body.candidatoId || Date.now();  // Si no se envía candidatoId, usar la fecha actual como nombre
        const fileExtension = path.extname(file.originalname);  // Obtener la extensión del archivo
        const originalName = file.originalname.split('.')[0];  // Obtener el nombre original sin la extensión
        const filename = `${originalName}${fileExtension}`;  // Ejemplo: 1234567890-nombreOriginal.pdf
        cb(null, filename);  // Se define el nombre del archivo
    }
});


// Validar que el archivo sea PDF (para los CV)
const cvFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
        cb(null, true);  // Aceptar el archivo
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);  // Rechazar el archivo
    }
};

// Ruta para subir CVs (solo PDF)
const uploadCV = multer({
    storage: createStorage('uploads/cv'),
    fileFilter: cvFileFilter,  // Carpeta de destino para CVs
    limits: { fileSize: 10 * 1024 * 1024 }  // Límite de 10MB
});


// Ruta para gestionar la subida de archivos
rutas.post('/subircv', uploadCV.single('archivo'), (req, res) => {
    console.log('Candidato ID recibido en backend:', req.body.candidatoId); // Debería mostrar el candidatoId que enviaste
    console.log('Archivo recibido:', req.file);
    
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se subió ningún archivo' });
    }

    res.status(200).json({
        mensaje: 'Archivo subido con éxito',
        archivo: req.file,
    });
});



rutas.get('/articulos', async (req, res) => {
    try {
        const articulos = await Articulo.default.find({});
        res.json(articulos);

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error al obtener artículos:", error);
    }
});

rutas.post('/articulos', async (req, res) => {
    try {
        const articulo = new Articulo.default(req.body);
        await articulo.save();
        res.status(201).json(articulo);
        console.log("Artículo guardado correctamente");
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al guardar artículo:", error);
    }
});

rutas.put('/articulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido:", id);


        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        // Intentar encontrar y actualizar el artículo
        const articulo = await Articulo.default.findByIdAndUpdate(id, req.body, { new: true });

        // Si no se encuentra el artículo
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        // Responder con el artículo actualizado
        res.json(articulo);
        console.log("Artículo actualizado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al actualizar artículo:", error);
    }
});

rutas.delete('/articulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido:", id);

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        // Intentar encontrar y eliminar el artículo
        const articulo = await Articulo.default.findByIdAndDelete(id);

        // Si no se encuentra el artículo
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        // Responder con el artículo eliminado
        res.json(articulo);
        console.log("Artículo eliminado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al eliminar artículo:", error);
    }
});

export default rutas;

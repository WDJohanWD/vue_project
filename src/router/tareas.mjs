import express from 'express';
const rutas = express.Router();
import multer from 'multer';

import tarea from '../models/tarea.mjs';

// Configuración de multer para cargar archivos
const upload = multer({ dest: 'uploads/' });

rutas.use(express.json());

// Obtener todas las tareas
rutas.get('/', async (req, res) => {
    try {
        const tareas = await tarea.find();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva tarea con archivo adjunto
rutas.post('/', upload.single('archivo'), async (req, res) => {
    try {
        // Verificar si hay un archivo adjunto
        if (req.file) {
            console.log('Archivo recibido:', req.file); // Registrar información sobre el archivo recibido
        } else {
            console.log('No se recibió ningún archivo.');
        }

        const nuevatarea = new tarea(req.body);

        await nuevatarea.save();
        console.log(nuevatarea);
        res.json({
            status: 'Tarea guardada'
        });
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        res.status(500).json({
            error: 'Error al guardar la tarea'
        });
    }
});

export default rutas;

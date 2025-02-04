import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from '../src/router/rutas.mjs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

//Se crea el servidor
const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5000'],  // Permitir el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permitir cookies y autenticación
}));

app.options('*', cors());  // Habilita CORS para preflight
app.use(express.urlencoded({ extended: true })); // ¡IMPORTANTE!
app.use(express.json());
app.use(morgan('dev'));
app.use(rutas);

// const upload = multer({ dest: 'uploads/' });
// app.use(upload.single('archivo'));


//elegimos puerto

//peticones
app.get('/', (req, res) => {
    res.send("Servidor para MongoDB");
});

//peticones

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/cv';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Usar el candidatoId enviado desde el frontend para nombrar el archivo
        //const candidatoId = req.body.candidatoId || Date.now();  // Si no se envía candidatoId, usar la fecha actual como nombre
        const fileExtension = path.extname(file.originalname);  // Obtener la extensión del archivo
        const originalName = file.originalname.split('.')[0];  // Obtener el nombre original sin la extensión

        // Concatenar candidatoId + el nombre original del archivo + la extensión
        const filename = `${originalName}${fileExtension}`;  // Ejemplo: 1234567890-nombreOriginal.pdf

        cb(null, filename) // Guardar el archivo con el nombre generado
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo de archivo no permitido'), false);
        }
        cb(null, true);
    }
});

// Ruta para gestionar la subida de archivos
app.post('/subircv', upload.single('archivo'), (req, res) => {
    console.log('Archivo recibido:', req.file);
    console.log('Candidato ID:', req.body.candidatoId);
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se subió ningún archivo' });
    }
    // Responder con el archivo subido y su ubicación
    res.status(200).json({
        mensaje: 'Archivo subido con éxito',
        archivo: req.file,
    });
});

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), () => {
    console.log(`Servidor en marcha en el puerto `, app.get('port'));
})
//mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
mongoose.connect('mongodb://root:renaido@localhost:27017/bbdd?authSource=admin')
    .then(db => console.log('conectado a mongodb'))
    .catch(err => console.log(err));  
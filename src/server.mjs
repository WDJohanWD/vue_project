import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rutas from '../src/router/rutas.mjs';
import multer from 'multer';

const app = express();
// Crear el servidor
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rutas);

//const upload = multer({ dest: 'uploads/' });
//app.use(upload.single('archivo'));

// Escuchar el puerto 5000
app.set('port', process.env.PORT || 5000);

// Ruta inicial
app.get('/', (req, res) => {
    res.send('Hola, este es tu servidor!');
});

// Iniciar el server
server.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});
//mongoose.connect('mongodb://root:renaido@localhost:27017/bbdd?authSource=admin')
mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin').then(db => console.log('conectado a mongodb')).catch(err => console.log(err));  
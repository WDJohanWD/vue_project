import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from '../src/router/rutas.mjs';
import cors from 'cors';


// se crea el servidor
const app = express();
const server = http.createServer(app);
// Habilitar CORS
// Configurar CORS para permitir solicitudes del frontend

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5000'],  // Permitir el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permitir cookies y autenticación
}));

// Middleware para manejar OPTIONS

app.options('*', cors()); 


 // Habilita CORS para preflight
app.use(express.urlencoded({ extended: true })); // ¡IMPORTANTE!
app.use(express.json());
app.use(morgan('dev'));
app.use(rutas);

// Servir la carpeta 'uploads' como estática



//peticones
app.get('/', (req,res) => {
    res.send("Servidor para MongoDB");
    });

app.use('/uploads', express.static('uploads'));

app.set('port', process.env.PORT  || 5000);

server.listen(app.get('port'),() => {
    console.log("servidor corriendo en puerto ...", app.get('port'))
});

//mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
mongoose.connect('mongodb://root:renaido@localhost:27017/bbdd?authSource=admin')
    .then(db => console.log('conectado a mongodb'))
    .catch(err => console.log(err));  
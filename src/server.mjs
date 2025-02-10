import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rutas from '../src/router/rutas.mjs';
import multer from 'multer';

// se crea el servidor
const app = express();
const server = http.createServer(app);
// Habilitar CORS
// Configurar CORS para permitir solicitudes del frontend

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rutas);

const upload = multer ({ dest:'uploads/' });
app.use(upload.single('archivo'));


app.set('port', process.env.PORT  || 5000);


app.get('/', (req,res) => {
    res.send("Servidor para MongoDB");
    });



server.listen(app.get('port'),() => {
    console.log("servidor corriendo en puerto ...", app.get('port'))
});

//mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
mongoose.connect('mongodb://root:renaido@localhost:27017/bbdd?authSource=admin')
    .then(db => console.log('conectado a mongodb'))
    .catch(err => console.log(err));  
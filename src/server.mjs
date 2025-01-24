//zona importaciones
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from '../src/router/rutas.mjs';
import cors from 'cors';
//Se crea el servidor
const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(rutas);


app.use(morgan('dev'));

//peticiones
app.get('/', (req,res) =>{
    res.send('Servidor corriendo');
});

//elegimos puerto
app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'),() =>{
    console.log(`Servidor en marcha en el puerto `, app.get('port'));
})
//mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
mongoose.connect('mongodb://root:renaido@localhost:27017/bbdd?authSource=admin')
    .then(db=>console.log('conectado a mongodb'))
    .catch(err=>console.log(err));  
import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

//BodyParser procesa las peticiones y prepara objeto
server.app.use(bodyParser.urlencoded({extended: true}));
//formato json
server.app.use(bodyParser.json());

//Rutas de mi app
server.app.use('/user', userRoutes);

// Conectar BD
mongoose.connect(
    'mongodb://localhost:27017/fotosgram', 
    { useNewUrlParser: true, useCreateIndex: true },
    (error) => {
        if (error) {
            throw error;
        }
        console.log('Base de datos online!')
    }
);
// Correr Servidor
server.start( () => {
    console.log(`Servidorr corriendo en el puerto ${ server.port }`);
});



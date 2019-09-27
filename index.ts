import Server from './classes/server';

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/usuario';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
const server = new Server();

// BodyParser procesa las peticiones y prepara objeto
server.app.use(bodyParser.urlencoded({extended: true}));
// formato json
server.app.use(bodyParser.json());

//FileUpload
server.app.use(fileUpload(
    {
        useTempFiles : true
    })
);

//Rutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

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


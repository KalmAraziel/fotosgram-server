import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class  FileSystem {
    constructor() {}

    guardarImagenTmp(archivo: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            // crear carpeta
            const path = this.crearCarpetaUsuario(userId);
            // nombre archivo
            const nombreArchivo = this.generarNombreUnico(archivo.name);

            // mover archivo temp  a carpeta final
            archivo.mv(`${ path }/${ nombreArchivo }`, (err : any) => {
                if (err) { 
                    reject(err);
                } else {
                    resolve();
                };
            });
        });        
       
    }

    private generarNombreUnico(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid();
        return idUnico + '.' + extension;
    }

    crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);
        // saber si existe el directorio
        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    imagenesTempHaciaPost(userId: string) {
        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');
        const pathPosts = path.resolve ( __dirname, '../uploads/', userId, 'posts');
       
        if (!fs.existsSync(pathTemp)){
            return [];
        }

        if (!fs.existsSync(pathPosts)){
            fs.mkdirSync(pathPosts);
        } 

        const imagenesTemp = this.obtenerImagenesTemp(userId);

        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${ pathTemp }/${ imagen }`, `${ pathPosts }/${ imagen }`);
        });

        return imagenesTemp;
    }

    private obtenerImagenesTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs.readdirSync(pathTemp) || []; 
    }

    getFotoUrl(userId: string, img: string) {
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img);
        const existe = fs.existsSync(pathFoto);
        if( !existe ) {
            return path.resolve(__dirname, '../assets/400x250.jpg');
        }
         
        return pathFoto;
    }
}
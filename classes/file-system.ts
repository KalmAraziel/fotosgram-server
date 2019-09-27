import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
export default class  FileSystem {
    constructor() {}

    guardarImagenTmp(archivo: FileUpload, userId: string) {
        // crear carpeta
        const path = this.crearCarpetaUsuario(userId);
        // nombre archivo
        const nombreArchivo = this.generarNombreUnico(archivo.name);
    }

    private generarNombreUnico(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];
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
}
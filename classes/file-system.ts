import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
export default class  FileSystem {
    constructor() {}

    guardarImagenTmp(imagen: FileUpload, userId: string) {
        const path = this.crearCarpetaUsuario(userId);
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
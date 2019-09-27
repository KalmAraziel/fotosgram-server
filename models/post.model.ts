import { Schema, model, Document } from "mongoose";
import { Usuario } from './usuario.model';

const postSchena = new Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Usuario debe existir' ]
    }

});

// triger se guarda y se actualiza la fecha
postSchena.pre<IPost>('save', function( next) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    mensajes: string;
    img: string[];
    coords: string;
    usuario: string;

}

export const Post = model<IPost>('Post', postSchena);
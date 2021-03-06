import { Schema, model, Document } from "mongoose";

const postSchena = new Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    imgs: [{
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
    imgs: string[];
    coords: string;
    usuario: string;

}

export const Post = model<IPost>('Post', postSchena);
import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import  hashSync  from 'bcrypt';

const userRoutes = Router();

// request lo que se pide, response lo que se retorna
userRoutes.post('/create', (req: Request , res: Response) => {        
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: hashSync.hashSync(req.body.password, 10),
    };
    // guardo en BD
    Usuario.create( user ).then( (userDB) => {
        // respuesta 
        res.json({
            ok: true,
            user: userDB
        });
    }).catch((error)=> {
        res.json({
            ok: false,
            error
        });
    });
    
});

export default userRoutes;
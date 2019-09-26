import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import  hashSync  from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../classes/autenticacion';

const userRoutes = Router();


// login 
userRoutes.post('/login', (req: Request , res: Response) => {
    const body = req.body;
    Usuario.findOne({email: body.email}, (error, userDB) => {
        if (error) throw error;
        
        if (!userDB) {
            res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }

        if( userDB !== null && userDB.compararPassword(body.password)){
            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar

            });

            res.json({
                ok: true,
                token : tokenUser
            });
        } else {
            res.json({
                ok: false,
                mensaje: 'Usuario / contraseña no son correctos'
            });
        }
    });
});

// crear Usuario request lo que se pide, response lo que se retorna
userRoutes.post('/create', (req: Request , res: Response) => {        
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: hashSync.hashSync(req.body.password, 10),
    };
    // guardo en BD
    Usuario.create( user ).then( (userDB) => {
        
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar

        });
        // respuesta 
        res.json({
            ok: true,
            token : tokenUser
        });
        
        
        
        
    }).catch((error)=> {
        res.json({
            ok: false,
            error
        });
    });
    
});

//actualizar usuario
userRoutes.put('/update', verificaToken ,(req: any , res: Response) => {  
    
    const usuario = {
        nombre: req.body.nombre || req.usuario.nombre ,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, usuario, { new: true }, (error , userDB) => {
        if (error) throw error;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario no existe'
            });
        }

        // generar nuevo token 
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar

        });

        res.json({
            ok: true,
            usuario: tokenUser
        });

    }).catch(error => {
        res.json({
            ok: false,
            error
        });
    });
    
    
});

export default userRoutes;
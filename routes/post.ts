import { Router, Request, Response } from "express";
import { verificaToken } from '../classes/autenticacion';
import { Post } from '../models/post.model';

const postRoutes = Router();
// Crear post
postRoutes.post('/', [verificaToken]  ,(req: any ,res: Response) => { 
    
    const body = req.body;

    body.usuario = req.usuario._id;

    Post.create(body).then(  async (postBd) =>{
        
        // Llenar usuario por relacion.
        await postBd.populate('usuario', '-password').execPopulate();
        
        res.json({
            ok: true,
            post: postBd
        });
    }).catch( (error) => {
        res.json({
            ok: false,
            error
        });
    });

    
} );
// Obtener  post
postRoutes.get('/', async (req: any ,res: Response) => { 
    let pagina = Number(req.query.pagina) || 1;    
    let skip  = pagina - 1;
    skip = skip * 10;
    const postBd = await Post.find()
                            // ordenar decendiente
                            .sort({_id: -1})
                            // saltar registros
                            .skip(skip)
                            // limite de busqueda
                            .limit(10)
                            // inner join con la tabla usuario
                            .populate('usuario', '--password')
                            .exec();  
        
    res.json({
        ok: true,
        post: postBd
    });
    
}); 

export default postRoutes;
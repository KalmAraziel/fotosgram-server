import { Router, Request, Response } from "express";
import { verificaToken } from '../classes/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
// Crear post
postRoutes.post('/', [verificaToken]  ,(req: any ,res: Response) => { 
    
    const body = req.body;

    body.usuario = req.usuario._id;
    const imagenes  = new FileSystem().imagenesTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;

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

// Obtener posts
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
        posts: postBd
    });
    
}); 

// Servicio para subir archivos
postRoutes.post('/upload', [verificaToken] , async (req: any ,res: Response) => { 
    // console.log('REQ: ', req.file);
    if (!req.files) { 
        return res.status(400).json({
            ok: false,           
            mensaje: 'no se subio ningun archivo'
        });
    }
    const file: FileUpload = req.files.image;
    
    if (!file) {
        return res.status(400).json({
            ok: false,           
            mensaje: 'no se subio ningun archivo - imagen'
        });
    } 

    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,           
            mensaje: 'debe subir una imagen'
        });
    }
    // guardo imagen
    const fileSystem = new FileSystem();    
    await fileSystem.guardarImagenTmp(file, req.usuario._id);
    
    res.json({
        ok: true,
        file: file.mimetype,
        mensaje: 'OK'
    });
});

postRoutes.get('/imagen/:userid/:img',(req: any ,res: Response) => { 
    const userid = req.params.userid;
    const img = req.params.img;
    const pathfoto = new FileSystem().getFotoUrl(userid,img);
    res.sendFile(pathfoto);
});

export default postRoutes;
import { Router, Request, Response } from "express";

const userRoutes = Router();

// request lo que se pide, response lo que se retorna
userRoutes.get('/prueba', (req: Request , res: Response) => {    
    res.json({
        ok: true,
        mensaje: 'funciona bien'
    });
});

export default userRoutes;
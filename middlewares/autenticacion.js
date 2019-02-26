const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


//==========================================
// middleware para verificar token
//==========================================
exports.verificaToken = (req, res, next) =>{
    let token = req.query.token;
    jwt.verify(token, SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}
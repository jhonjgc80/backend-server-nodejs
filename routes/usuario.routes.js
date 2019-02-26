const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');




const app = express();

//importammos el modelo de usuario
const Usuario = require('../models/usuario');

//==========================================
// Peticion para obtener todos los registros
//==========================================
app.get('/', (req,res,next) => {
    Usuario.find({}, '-password')
    .exec((err, usuarios, ) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }
        res.status(200).json({ ok: true, usuarios});
    });
});

//==========================================
// Peticion para crear nuevos registros
//==========================================
app.post('/', [verificaToken] ,(req, res)=>{
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            });
        }
        res.status(201).json({ ok: true, usuario: usuarioDB});
    });
});

//==========================================
// Peticion para actualizar registros
//==========================================
app.put('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);

    Usuario.findOneAndUpdate(id, body, {new: true},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: {message: `No existe el usuario con id: ${id}`}
            });
        }
        usuarioDB.password = ':)';
        res.status(200).json({ ok: true, usuario: usuarioDB});

        // usuario.save((err, usuarioDB)=>{
        //     if(err){
        //         return res.status(400).json({
        //             ok: false,
        //             mensaje: 'Error al actualizar usuario',
        //             errors: err
        //         });
        //     }
        //   res.status(200).json({ ok: true, usuario: usuarioDB});
        // });
    });
});

//==========================================
// Peticion para borrar registros
//==========================================
app.delete('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err || !usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err:{ message: 'Usuario no encontrado!'}
            });
        }
        res.status(200).json({ ok: true, usuario: usuarioBorrado});
    });
});
module.exports = app;
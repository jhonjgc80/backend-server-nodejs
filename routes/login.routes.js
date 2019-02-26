const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

const app = express();

//importammos el modelo de usuario
const Usuario = require('../models/usuario');

app.post('/', (req, res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
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
                errors: {message: 'Usuario o contraseña incorrectos'}
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                errors: {message: 'Usuario o contraseña incorrectos'}
            });
        }

        //creamos el token
        usuarioDB.password = ':)';
       let token = jwt.sign({usuario: usuarioDB},SEED, {expiresIn: 14400}) //4horas


        res.status(200).json({ ok: true, usuario: usuarioDB, id: usuarioDB._id, token});
    })


    
})



module.exports = app;
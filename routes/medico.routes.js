const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


const Medico = require('../models/medico');

//==========================================
// Peticion para obtener todos los medicos
//==========================================
app.get('/', (req,res,next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
    .exec((err, medicos ) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando medicos',
                errors: err
            });
        }
        Medico.countDocuments({}, (err, conteo)=>{
            res.status(200).json({ ok: true, medicos, total: conteo});
        });
    });
});

//==========================================
// Peticion para crear nuevos registros
//==========================================
app.post('/', verificaToken ,(req, res)=>{
    let body = req.body;
    let medico = new Medico({
        nombre: body.nombre,
        //img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital //body.hospital
    });
    medico.save((err, medicoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico',
                errors: err
            });
        }
        if(!medicoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({ ok: true, medico: medicoDB});
    });
});

//==========================================
// Peticion para actualizar registros
//==========================================
app.put('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);

    Medico.findById(id,{new: true},(err, medicoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false, 
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if(!medicoDB){
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: {message: `No existe el medico con id: ${id}`}
            });
        }

        medicoDB.nombre = body.nombre;
        medicoDB.usuario = req.usuario._id;
        medicoDB.hospital = body.hospital;

        medicoDB.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });
});

//==========================================
// Peticion para borrar registros
//==========================================
app.delete('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{
        if(err || !medicoBorrado){
            return res.status(400).json({
                ok: false,
                err:{ message: 'Medico no encontrado!'}
            });
        }
        res.status(200).json({ ok: true, medico: medicoBorrado});
    });
});

module.exports = app;
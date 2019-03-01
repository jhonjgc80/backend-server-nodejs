const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');


const app = express();


const Hospital = require('../models/hospital');

//==========================================
// Peticion para obtener todos los registros
//==========================================
app.get('/', (req,res,next) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales ) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }
        Hospital.countDocuments({}, (err, conteo)=>{
            res.status(200).json({ ok: true, hospitales, total: conteo});
        });
    });
});

//==========================================
// Peticion para crear nuevos registros
//==========================================
app.post('/', verificaToken ,(req, res)=>{
    let body = req.body;
    let hospital = new Hospital({
        nombre: body.nombre,
        //img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errors: err
            });
        }
        res.status(201).json({ ok: true, hospital: hospitalDB});
    });
});

//==========================================
// Peticion para actualizar registros
//==========================================
app.put('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role']);

    Hospital.findByIdAndUpdate(id, {nombre: body.nombre , usuario: req.usuario._id}, {new: true},(err, hospitalDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if(hospitalDB.nombre === null){
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: {message: `No existe el hospital con id: ${id}`}
            });
        }
        res.status(200).json({ ok: true, hospital: hospitalDB});
    });
});

//==========================================
// Peticion para borrar registros
//==========================================
app.delete('/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{
        if(err || !hospitalBorrado){
            return res.status(400).json({
                ok: false,
                err:{ message: 'Hospital no encontrado!'}
            });
        }
        res.status(200).json({ ok: true, hospital: hospitalBorrado});
    });
});


module.exports = app;
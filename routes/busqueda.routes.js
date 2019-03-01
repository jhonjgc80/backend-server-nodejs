let express = require('express');

let app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');

//==========================================
//           Busqueda especifica
//==========================================
app.get('/especifica/:coleccion/:busqueda', (req, res)=>{
    let busqueda = req.params.busqueda;
    let coleccion = req.params.coleccion;
    let regex = new RegExp(busqueda, 'i');
    let promesa;
    switch (coleccion) {
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        default:
            return res.status(400).json({ 
                ok: false, 
                error: {message: 'Parametro de colección no permitido'}
            });
    }

    promesa.then(resultado=>{
        res.status(200).json({ 
            ok: true, 
            [coleccion]: resultado,
            Total : `${coleccion} - ${resultado.length}`
        });
    });
       
});

// app.get('/usuario/:busqueda', (req, res)=>{
//     let busqueda = req.params.busqueda;
//     let regex = new RegExp(busqueda, 'i');
//     buscarUsuarios(regex).then(usuarios=>{
//         res.status(200).json({ 
//             ok: true, 
//             usuarios,
//             totalUsuarios: usuarios.length
//         });
//     });
// });


//==========================================
//             Busqueda general
//==========================================
app.get('/todo/:busqueda', (req, res)=>{
    let busqueda = req.params.busqueda;
    //creamos una expresion regular para la busqueda
    let regex = new RegExp(busqueda, 'i');
    Promise.all([buscarHospitales(regex), buscarMedicos(regex), buscarUsuarios(regex)])
        .then(respuestas => {
            res.status(200).json({ 
                ok: true, 
                hospitales: respuestas[0],
                totalHospitales: respuestas[0].length,
                medicos: respuestas[1],
                totalMedicos: respuestas[1].length,
                usuarios: respuestas[2],
                totalUsuarios: respuestas[2].length});
        });

});

function buscarHospitales(regex) {
    return new Promise((resolve, reject)=>{
        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=>{
                if(err){
                    reject('Error al cargar hospitales', err);
                }else{
                    resolve(hospitales)
                }
            });
    });
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject)=>{
        Medico.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos)=>{
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos)
            }
        });
    });
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject)=>{
        //opcion para buscar en mas de una columna de un documento
        Usuario.find({}, ' nombre email role').or([{'nombre': regex}, {'email': regex}]).exec((err, usuarios)=>{
            if(err){
                reject('Error al buscar usuarios', err);
            }else{
                resolve(usuarios)
            }
        })
    });
}

module.exports = app;


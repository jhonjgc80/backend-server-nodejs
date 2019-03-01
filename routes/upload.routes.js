const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
//const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

app.use(fileUpload());


app.put('/:coleccion/:id', (req,res,next) => {
    let {id, coleccion} = req.params;
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos cargados',
            errors: {message: 'Debe seleccionar un archivo'}
        });
    }

    //validamos que los archivos sean solo de la coleccion hospital, medico o usuario
    let coleccionValida = ['medicos', 'hospitales', 'usuarios'];
    if (coleccionValida.indexOf(coleccion)<0) {
        return res.status(400).json({
            ok: false,
            message: `Las colecciones permitidas para los archivos son: ${coleccionValida.join(', ')}`
        });
    }

    //Obtener nombre del archivo y extension
    let archivo = req.files.imagen;
    let nombreDividido = archivo.name.split('.'); 
    let extensionArchivo = nombreDividido[nombreDividido.length - 1];
    //Validamos las extensiones permitidas
    let extensionesValidas = ['jpg','png','gif','jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo)<0) {
        return res.status(400).json({
            ok: false,
            mensaje: `Las extensiones permitidas son: ${extensionesValidas.join(', ')} Ext: ${extensionArchivo}`
        });
    }

    //Cambiamos el nombre al archivo para que sea unico
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    
    //Movemos el archivo del temporal a un path especifico
    let  path = `./uploads/${coleccion}/${nombreArchivo}`;

    archivo.mv(path, (err)=>{
        if (err){
            return res.status(500).json({  
                ok: false,
                err
            })
        }

        subirPorColeccion(coleccion, id, nombreArchivo, res);
    });
});

function subirPorColeccion(coleccion, id, nombreArchivo, res) { 
    
    let Modelos = {
        usuarios: Usuario,
        medicos: Medico,
        hospitales: Hospital
    };

    if (Modelos.hasOwnProperty(coleccion)) {
        
        Modelos[coleccion].findById(id, (err, modelo)=>{
            if (err) {
                borrarArchivo(nombreArchivo, coleccion);
                return res.status(500).json({  
                    ok: false,
                    err
                });
            }
            if (!modelo) {
                borrarArchivo(nombreArchivo, coleccion);
                return res.status(404).json({
                    ok: false,
                    errors: {message: 'Registro no encontrado'}
                });
            }
            borrarArchivo(modelo.img, coleccion);            
            modelo.img = nombreArchivo;

            modelo.save((err, modeloGuardado)=>{
                res.status(200).json({  
                    ok: true,
                    mensaje: 'Imagen guardada',
                    [coleccion]: modeloGuardado
                });
            })
        })
    }
 }

 function borrarArchivo(nombreArchivo, coleccion) {
     //verificamos la existencia de la ruta si existe eliminamos 
            //el archivo anterior
            let pathOld = `./uploads/${coleccion}/${nombreArchivo}`;
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld, (err)=>{
                    if (err) {
                        return res.status(500).json({  
                            ok: false,
                            err: {message: 'No se pudo eliminar el archivo'}
                        });
                    } 
                });
            }
 }

module.exports = app;
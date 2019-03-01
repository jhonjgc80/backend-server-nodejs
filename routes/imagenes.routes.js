
const express = require('express');
const path = require('path');//ayuda a obtener un path correcot para un archivo
const fs = require('fs');


const app = express();

app.get('/:coleccion/:img', (req,res,next) => {
    let {coleccion, img} = req.params;

    let pathImagen = path.resolve(__dirname, `../uploads/${coleccion}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }else{
        let pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }
});

module.exports = app;

//requires
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');


const app = express();

//settings, configuraciones del servidor
app.set('port', process.env.PORT || 3000);

//conexion a la base de datos
mongoose.connect('mongodb://localhost/hospitalDB', { useNewUrlParser: true }, (err, res)=>{
    if(err) throw err;
    console.log(colors.yellow('Base de datos'),colors.green('Online'));
})

//Routes con express
app.get('/', (req,res,next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
})


app.listen(app.get('port'), () =>{
    console.log('Server online en el puerto: '.yellow , colors.green(app.get('port')));
});
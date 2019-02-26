
//==========================================
//              Requires
//==========================================
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');


//==========================================
//            Inicializar variables
//==========================================
const app = express();

//==========================================
//              Body Parser
//==========================================
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
//app.use(bodyParser.json())
app.use(express.json()); //de esta forma no es necesario installar el bodyparser???
app.use(express.urlencoded({ extended: false }));

//==========================================
//              Importar rutas
//==========================================
let appRoutes = require('./routes/app.routes');
let usuarioRoutes = require('./routes/usuario.routes');
let loginRoutes = require('./routes/login.routes');


//==========================================
//  settings, configuraciones del servidor
//==========================================
app.set('port', process.env.PORT || 3000);

//==========================================
//       conexion a la base de datos
//==========================================
mongoose.connect('mongodb://localhost/hospitalDB', { useNewUrlParser: true }, (err, res)=>{
    if(err) throw err;
    console.log(colors.yellow('Base de datos'),colors.green('Online'));
})

//
//==========================================
//              Routes
//==========================================
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


app.listen(app.get('port'), () =>{
    console.log('Server online en el puerto: '.yellow , colors.green(app.get('port')));
});
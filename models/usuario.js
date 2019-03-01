//Esquema para la coleccion usuarios de la DB
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} rol no permitido'
};

let usuarioSchema = new Schema({
    nombre:{ type: String, required: [true, 'El nombre es necesario'] },
    email:{ type: String, required: [true, 'El correo es necesario'], unique: true },
    password:{ type: String, required: [true, 'La contraseña es necesaria'] },
    img:{ type: String, required: false },
    role:{ type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe!!!'});

module.exports = mongoose.model('Usuario', usuarioSchema);
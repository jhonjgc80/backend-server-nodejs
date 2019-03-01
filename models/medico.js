//Esquema para la coleccion medicos de la DB
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});


module.exports = mongoose.model('Medico', medicoSchema);
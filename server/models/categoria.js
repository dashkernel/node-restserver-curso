const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { //Valores de la base de datos
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es necesario']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es necesario']
    },
    estado: { //boolean
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

//Lineas adicionales para hacer validaciones de llaves 
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);


categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model('Categoria', categoriaSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: { //Valores de la base de datos
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: { //no obligatorio
        type: String,
        required: false
    },
    role: { //El rol debe ser obligatorio pero al no ponerlo default lo hace
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: { //boolean
        type: Boolean,
        default: true
    },
    google: { //boolean
        type: Boolean,
        default: false
    }
});

//Lineas adicionales para hacer validaciones de llaves
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

// quitar el password de la salida de JSON
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
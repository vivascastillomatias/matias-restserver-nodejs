//Maneja y controla el esquema establecido para la comunicacion con la base de datos de Mongo

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Lineas agregadas por advertencias de desaprobacion
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
        
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
})

//Modifica el metodo 'toJSON'. Este metodo siempre se utiliza cuando se va a imprimir el esquema, como no queremos
//devolver la contraseña, se la elimina solo cuando se llama ese método. Se convierte en una funcion que realice que que se desee
//En este caso se elimina el campo de la contraseña

usuarioSchema.methods.toJSON = function () {4
    //Se convierte el esquema en un objeto para poder eliminar el atributo de la contaseña

    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;

    return userObjet;
}

//Herramienta mongoose-unique-validator para manejar los mensajes de error por duplicacion de atributos que especificamos como únicos.
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});


//Se exporta para ser utilizado
module.exports = mongoose.model('Usuario', usuarioSchema);


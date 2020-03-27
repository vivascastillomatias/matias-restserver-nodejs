let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let productoSchema = new Schema({
    nombre: {
        unique: true,
        type: String,
        required: [true, 'El nombre es necesario'] 
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true, 
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria', 
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Producto', productoSchema);
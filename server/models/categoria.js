//Maneja y controla el esquema establecido para la comunicacion con la base de datos de Mongo

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Lineas agregadas por advertencias de desaprobacion
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' } //Establece una relacion con la coleccion de usuarios
})

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Categoria', categoriaSchema);
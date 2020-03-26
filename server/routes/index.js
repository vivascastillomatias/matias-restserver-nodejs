//Definicion global de rutas

const express = require('express');
const app = express();

app.use(require('../routes/usuario'));
app.use(require('../routes/login.js'));


module.exports = app;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
require('./config/config.js');

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(require('./routes/usuario.js'));
//
//app.use(require('./routes/login.js'));


app.use(require('./routes/index')); //configuración global de rutas




let rutaPublic = path.resolve(__dirname,'../public');

app.use(express.static(rutaPublic));


//Conexion a la base de datos local
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true}, 
  (err, res) => {
      if (err) throw err;
      console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto ", process.env.PORT);
})
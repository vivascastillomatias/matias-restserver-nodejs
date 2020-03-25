const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('./config/config.js');

// parse application/json
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/usuario.js'));
    
app.get('/', function (req, res) {
    res.send('RESTSERVER DE @vivascastillomatias');
});
    
    
    


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
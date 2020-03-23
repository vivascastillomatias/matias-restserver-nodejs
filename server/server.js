const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send('RESTSERVER DE @vivascastillomatias');
  });


require('./config/config.js');
//method GET
//Se utiliza para consultas
app.get('/usuario', function (req, res) {
  res.json('get Usuario');
});

//method POST
//Generalmente se utiliza para crear nuevos registros de datos
app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            description: "El nombre es necesario"
        });

    } else {
        salida = {
            method: 'POST',
            persona: body
        }
        res.json(salida);
    }
    
});

//method PUT
//Generalmente se utiliza para actualizar datos localhost:3000/parametro
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let salida = {
        method: 'PUT',
        id
    }
    res.json(salida);
});

//method PUT
//Generalmente se utiliza para actualizar datos
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario')
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando peticiones en el puerto ", process.env.PORT);
})
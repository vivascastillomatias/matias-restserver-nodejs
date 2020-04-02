const express = require('express');
const app = express();

//Modelo de datos de Usuario
const Usuario = require('../models/usuario.js');
const bcrypt = require('bcrypt');

//la biblioteca underscore se usa por convención como " _ "
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/authentication.js');

//method GET
//Se utiliza para consultas
app.get('/usuario', verificaToken, (req, res) => {
    //query son todos los parámetros que se establecen despues del ? en la dirección 


    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 8;

     //linea para convertir a numero el parámetro que viene como String
    desde = Number(desde);
    hasta = Number(hasta);

    //find({Condicion para que sea devuelto en la búsqueda}, [a,b] Campos que se devolverán en el json)
    Usuario.find({estado: true},['estado','nombre','email','role','google','img'])
    .skip(desde) //Salto de registros, se muestran a partir del valor establecido.
    .limit(hasta)//Limite de registros, a partir del valor del skip, la cantidad de registros establecida
    .exec((err, resultado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }else{

            Usuario.countDocuments({estado: true}, (err, conteo) => {
                if(err) throw err;
                res.json({
                    ok: true,
                    cantTotal: conteo,
                    cantQuery: resultado.length,
                    usuarios: resultado
                });
            })
        }
    } )
});

//method POST
//Generalmente se utiliza para crear nuevos registros de datos
app.post('/usuario',[verificaToken,verificaAdminRole], function (req, res) {
    let body = req.body;
    console.log(body);
    //Creamos un objeto de tipo Usuario qu se estableció su forma en models/usuario.js
    //Todo lo que viene por el POST se almancena en un nuevo objeto de tipo Usuario

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        img: body.img,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    })

    usuario.save( (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }else{
            //usuarioDB.password = null;

            res.send({
                ok: true,
                usuario: usuarioDB
            })
        }
    })
});

//method PUT
//Generalmente se utiliza para actualizar datos localhost:3000/parametro
app.put('/usuario/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = req.body;

    //Se utiliza .pick del paquete underscore para realizar un filtrado de campos sobre el cuerpo del body.
    //Se utiliza para no tener en cuenta, por ejemplo la contraseña. (Para que no se pueda cambiar)
    datos = _.pick(body,['nombre','email','role','estado','google'])

    opciones = {
        new: true,
        runValidators: true
    }
 
    Usuario.findByIdAndUpdate(id, datos, opciones,(err, usuarioDB) => {
    //El tercer argumento se pone entre paréntesis porque es un objeto
    //dicho objeto es el que devuelve la operacion de actualización

        if (err) {
            if (err.code === 11000){
                err = {
                    message: 'El email debe ser unico'
                }
            }
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.send({
            ok: true,
            usuario: usuarioDB
        })
 
    })
});

//method DELETE
//Generalmente se utiliza para actualizar datos
app.delete('/usuario/:id',[verificaToken,verificaAdminRole], function (req, res) {

    let id = req.params.id;

    opciones = {
        new: true,
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id, {'estado': false}, opciones,(err, usuarioDeshabilitado) => {
    //El tercer argumento se pone entre paréntesis porque es un objeto,
    // dicho objeto es el que devuelve la operacion de actualización
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }else{
            res.send({
                ok: true,
                usuarioDeshabilitado
            })
        }
    
    });

    //ELIMINACIÓN FISICA
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }else if (usuarioBorrado == null){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }else{
            res.send({
                ok: true,
                usuarioBorrado
            })
        }
    })*/

    
});

module.exports = app;
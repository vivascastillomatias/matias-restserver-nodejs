const express = require('express');
const app = express();

const Usuario = require('../models/usuario.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioDB == null){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) y contraseña incorrectos'
                }
            });
        }

        //Verificar si la contraseña existe con el email encontrado
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y (contraseña) incorrectos'
                }
            });
        }else{
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD})
    
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
        }

    })

});

module.exports = app;
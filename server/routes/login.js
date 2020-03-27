const express = require('express');
const app = express();

const Usuario = require('../models/usuario.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);




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

//CONFIGURACION DE GOOGLE

async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: payload.email_verified
    }
  }

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
    .catch((err) => { 
        res.status(403).json({
            ok: false,
            err
        })
    });

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                //Está en la base de datos pero cuando fue creado no se autenticó con google
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            }else{
                //Está en la base de datos y fue creado no se autenticó con google. Se renueva su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD})
        
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //El usuario no existe en la base de datos. Debe crearse
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                password: 'vacio',
                google: true
            })
            usuario.save((err, usuarioDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }else{
                    //usuarioDB.password = null;
                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD})

                    return res.send({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                }
            })
        }
    })
});

module.exports = app;
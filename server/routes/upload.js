const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const Usuario = require('../models/usuario.js');
const Producto = require('../models/producto.js');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    //Verificar el tipo de coleccion que se va a modificar
    let tiposValidos = ['usuario','producto','etc'];
    if (!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No tiene permiso para modificar'

            }
        });
    }

    //Verificar la carga del archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    let sampleFile = req.files.file;
    
    //Validar la extensión del archivo
    let extensionesValidas = ['image/png','image/jpg','image/jpeg','image/gif'];
    let extension = sampleFile.mimetype
    if (!extensionesValidas.includes(extension)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se admite el tipo de archivo. Las extensiones permitidas son png, jpg, jpeg, gif'

            }
        });
    }

    //Cambiar nombre al archivo
    let fileName = id + "__" + req.files.file.name 


    //Armar la ruta en donde se guardará el archivo dependiendo el tipo que se solicitó
    let rutaPublic = path.resolve(__dirname,`../../uploads/${tipo}`);
    let uploadPath = rutaPublic + "\\"+ fileName;
    
    sampleFile.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
            });
        }

        if (tipo == 'usuario') {
            imagenUsuario(id, res, fileName);
        }
        if (tipo == 'producto') {
            imagenProducto(id, res, fileName);
        }
    });

});


let imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id,(err, usuarioDB) =>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
              });
        }
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            return res.json({
                ok: true,
                message : 'Imagen subida correctamente',
                usuario: usuarioGuardado
            });
        })

        
    })
}

let imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id,(err, productoDB) =>{
        if (err) {
            return res.status(500).json({
              ok: false,
              err
              });
        }
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            return res.json({
                ok: true,
                message : 'Imagen subida correctamente',
                producto: productoDB
            });
        })

        
    })
}
module.exports = app;
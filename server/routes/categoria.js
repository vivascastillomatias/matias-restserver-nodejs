const express = require('express');
const app = express();

//Modelo de datos de Categoría.
const Categoria = require('../models/categoria.js');

const { verificaToken, verificaAdminRole } = require('../middlewares/authentication.js');

//Listar todas las categorías, paginadas
app.get('/categoria',verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 8;
    //linea para convertir a numero el parámetro que viene como String
    desde = Number(desde);
    hasta = Number(hasta);
    Categoria.find()
    .sort('nombre') //Ordenamiento
    .populate('usuario', ['nombre','email']) //Relacion con otra coleccion
    .skip(desde)
    .limit(hasta)
    .exec((err, resultado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                categorias: resultado
            });
        }
    })
});

//Buscar una categoría por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                categoria: categoriaBD
            });
        }
    })
});

//Crear una categoría
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    let nombre = req.body.nombre;
    let usuario = req.usuario._id;

    let categoria = new Categoria({
        nombre,
        usuario
    })

    categoria.save((err, categoriaBD)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                categoria: categoriaBD
            });
        }
    })
});

//Actualizar una categoría por id
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let nombre = req.body.nombre;
    let usuario = req.usuario._id;

    datosActualizados = {
        'nombre': nombre,
        'usuario': usuario
    }

    opciones = {
        new: true
    }
    Categoria.findByIdAndUpdate(id,datosActualizados,opciones,(err, categoriaBD)=> {
        if (err) {
            if (err.code === 11000){
                err = {
                    message: 'El nombre de la categoria debe ser unico'
                }
            }
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                categoria: categoriaBD
            });
        }
    })

});

//Borrar una categoría por id
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    opciones = {
        new: true
    }
    Categoria.findByIdAndRemove(id,opciones,(err, categoriaBorrada)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                categoriaBorrada
            });
        }
    })

});

module.exports = app;
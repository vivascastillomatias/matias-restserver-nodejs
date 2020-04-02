const express = require('express');
const app = express();

//Modelo de datos de productp.
const Producto = require('../models/producto.js');
const Categoria = require('../models/categoria.js');

const { verificaToken, verificaAdminRole } = require('../middlewares/authentication.js');

//Listar todos los productos con Usuario y categoría.Paginado
app.get('/producto',verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 8;
    //linea para convertir a numero el parámetro que viene como String
    desde = Number(desde);
    hasta = Number(hasta);
    Producto.find({'disponible': true})
    .sort('nombre') //Ordenamiento
    .populate('usuario', ['nombre','email']) //Relacion con otra coleccion
    .populate('categoria', ['nombre']) //Relacion con otra coleccion
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
                productos: resultado
            });
        }
    })
});

//buscar un producto por id
app.get('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
    .populate('categoria', ['nombre']) //Relacion con otra coleccion
    .populate('usuario', ['nombre','email']) //Relacion con otra coleccion
    .exec((err, productoBD)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    })
});

//buscar un producto por nombre
app.get('/producto/buscar/:termino',verificaToken, (req, res) => {
    let termino = req.params.termino;

    //Para hacer %, se deben hacer expresiones regulares
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/RegExp
    let expReg = new RegExp(termino, 'i');

    Producto.find({'nombre': expReg})
    .populate('categoria', ['nombre']) //Relacion con otra coleccion
    .populate('usuario', ['nombre','email']) //Relacion con otra coleccion
    .exec((err, productoBD)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoBD
        });
    })
});

//crear un producto
app.post('/producto',verificaToken, async(req, res) => {
    //con Usuario y categoría
    //Grabar usuario
    //Grabar categoria del listado de categorias

    let nombre = req.body.nombre;
    precioUni = Number(req.body.precioUni);
    let descripcion = req.body.descripcion;
    let disponible = req.body.disponible;
    let categoria = req.body.categoria;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario
    })
    
    producto.save((err, productoBD)=> {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                producto: productoBD
            });
        }
    })
        
});
    
//Actualizar un producto
app.post('/producto/:id',verificaToken, async(req, res) => {
    //con Usuario y categoría
    //Grabar usuario
    //Grabar categoria del listado de categorias
    let id = req.params.id;

    let nombre = req.body.nombre;
    precioUni = Number(req.body.precioUni);
    let descripcion = req.body.descripcion;
    let disponible = req.body.disponible;
    let categoria = req.body.categoria;
    let usuario = req.usuario._id;
    
    datosActualizados = {
        'nombre': nombre,
        'precioUni': precioUni,
        'descripcion': descripcion,
        'disponible': disponible,
        'categoria': categoria,
        'usuario': usuario
    }
    opciones = {
        new: true
    }

    Producto.findByIdAndUpdate(id, datosActualizados, opciones,(err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.send({
            ok: true,
            usuario: usuarioDB
        })
    });
});

//Borrar un producto
app.delete('/producto/:id',verificaToken, (req, res) => {
    let id = req.params.id;

    opciones = {
        new: true
    }

    Producto.findByIdAndUpdate(id, {'disponible': false}, opciones,(err, usuarioDeshabilitado) => {
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
});

module.exports = app;

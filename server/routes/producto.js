const express = require('express');

const { VerificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const Categoria = require('../models/categoria');

// ===============================
// Obtener todos los productos
// ===============================
app.get('/productos', VerificaToken, (req, res) => {
    //Trae todos los productos
    //populate: usuario y categoria
    //paginado
    //solo aparezcan los disponibles

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limitePagina = req.query.limitePagina || 5;
    limitePagina = Number(limitePagina);

    // console.log(desde, limitePagina);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limitePagina)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
});

// ===============================
// Obtener productos por ID
// ===============================
app.get('/productos/:id', VerificaToken, (req, res) => {
    //populate: usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });


});

// ===============================
// Buscar un producto
// ===============================

app.get('/productos/buscar/:termino', VerificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //i => omitir case sensitive

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });
});

// ===============================
// Crear nuevo producto
// ===============================
app.post('/productos', VerificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });


});


// ===============================
// Actualizar productos por ID
// ===============================
app.put('/productos/:id', VerificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria del listado

    let body = req.body;
    let id = req.params.id;

    /*Mi Forma
    let producto = ({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    Producto.findByIdAndUpdate(id, producto, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No Existe el producto'
                }
            });
        }

        res.status(202).json({
            ok: true,
            producto: productoDB
        });

    });
    */

    //Segunda forma

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No Existe el producto'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(202).json({
                ok: true,
                producto: productoGuardado
            });

        });
    });

});

// ===============================
// Borrar productos por ID
// ===============================
app.delete('/productos/:id', VerificaToken, (req, res) => {
    //cambiar "disponible" a falso

    let id = req.params.id;
    let prodDisp = {
        disponible: false
    }

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'ID de producto inexistente'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto fuera de stock: ' + productoBorrado.nombre
            })
        });

    });

});



module.exports = app;
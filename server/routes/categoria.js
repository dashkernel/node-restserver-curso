const express = require('express');

const { VerificaToken, VerificaAdmin_Role } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

const Categoria = require('../models/categoria');

// ===========================
// Mostrar todas las categorias
// ===========================
app.get('/categoria', VerificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })

            // Categoria.count({ estado: true }, (err, conteo) => {
            //     res.json({
            //         ok: true,
            //         categorias,
            //         cuantos: conteo
            //     })
            // })

        });

});

// ===========================
// Mostrar categoria por ID
// ===========================
app.get('/categoria/:id', VerificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaID) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaID
        })

    });

});


// ===========================
// Crear nueva categoria
// ===========================
app.post('/categoria', VerificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id //Si no se manda el VerificaToken no se va a tener el _id
    })

    // return res.json({
    //     categoria
    // })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

// ===========================
// Editar la desripcion de la categoria por ID
// ===========================
app.put('/categoria/:id', VerificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    // let body = _.pick(req.body, ['descripcion']); // Una forma
    //Segunda forma
    let descCategoria = {
        descripcion: body.descripcion
    };

    // console.log(body);

    // Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaID) => { //Una forma
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

// ===========================
// Borrar categoria por ID
// ===========================
app.delete('/categoria/:id', [VerificaToken, VerificaAdmin_Role], (req, res) => {
    //Solo la puede borrar un administrador
    //Debe pedir el token
    //Debe eliminarse logicamente la categoria =>  Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaID) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            // categoria: categoriaID,
            message: 'Categoria removida:' + categoriaID.descripcion
        })

    });

});

module.exports = app;
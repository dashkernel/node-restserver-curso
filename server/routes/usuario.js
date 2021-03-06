const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { VerificaToken, VerificaAdmin_Role } = require('../middlewares/autenticacion'); //middleware

const app = express();

//Listar usuarios
app.get('/usuario', VerificaToken, (req, res) => {
    // res.json('get Usuario LOCAL');

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limitePagina = req.query.limitePagina || 5;
    limitePagina = Number(limitePagina);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //traer todos los registros de la coleccion
        .skip(desde) //saltar registros
        .limit(limitePagina) //obtener 5 usuarios
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            });

        })

});

//Crear registro
app.post('/usuario', [VerificaToken, VerificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //password: body.password,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /*
    if (body.nombre == undefined) {
        res.status(400).json({
            ok: false,
            msg: "El nombre es necesario"
        });
    } else {
        res.json({
            persona: body
        });
    }
    */
});

//Actualizar registro
app.put('/usuario/:id', [VerificaToken, VerificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //eliminar propiedades del objeto para que no sean actualizables con PUT (ineficiente si son muchas propiedades se usa en ese caso underscore.js _ con pick)
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

app.delete('/usuario/:id', [VerificaToken, VerificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    // Usuario.findByIdAndUpdate(id, {estado:false}, { new: true }, (err, usuarioInactivo) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

    /*Ya no se acostumbra borrar un registro solo cambiar su estado
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    */

    // res.json('delete Usuario');
});

module.exports = app;
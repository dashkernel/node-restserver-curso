const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/uploads/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se han subido arhvos'
            }
        });
    }

    // ===================================
    //    valida tipo
    // ===================================

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                tipo: tipo,
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        })
    }

    // ===================================
    //    Extensiones permitidas
    // ===================================
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // console.log(nombreCortado, extension);

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                ext: extension,
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        })
    }

    // ===================================
    //    Subir un archivo
    // ===================================

    //      Cambiar nombre a un archvio previniento con los milisegundos que la cache del browser pueda obtener el mismo nombre para el archivo y sobrescribirlo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // archivo.mv(`uploads/${tipo}/${archivo.name}`, (err) => {
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Imagen cargada en FileSystem
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }




        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });
    });

});

function imagenUsuario(id, res, nombreArchivo) { //res es un objeto que node toma como referenciado por lo tanto se puede pasar directamente
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            //Aunque suceda un error la imagen si se subio para prevenir que el directorio se llene de basura
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            //Aunque el usuario no exista borrar la imagen que se subio para prevenir que el directorio se llene de basura
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        // console.log(__dirname);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
                message: 'Imagen de usuario guardada correctamente'
            });

        });



    });

}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            //Aunque suceda un error la imagen si se subio para prevenir que el directorio se llene de basura
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            //Aunque el usuario no exista borrar la imagen que se subio para prevenir que el directorio se llene de basura
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB: productoGuardado,
                img: nombreArchivo,
                message: 'Imagen de producto guardada correctamente'
            });

        });



    });
}

function borraArchivo(nombreImagen, tipo) {
    //Validar si existe la imagen previamente en FS, si es asi borrarla para actualizarla con la nueva, sino existe no hacer una accion
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        console.log('existe');
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
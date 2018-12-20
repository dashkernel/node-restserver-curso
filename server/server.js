require('./config/config');
require('colors');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// Middleware: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Habilitar la carpeta public (varias formas)
//Forma 1 
//app.use(express.static(__dirname + '/../public'));
//Forma 2
//app.use(express.static(path.resolve(__dirname, '../public')));
//Forma 3
app.use(express.static('public'));

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('[*] Base de datos ONLINE'.yellow);

});

app.listen(process.env.PORT, () => {
    console.log(`[*] Escuchando puerto ${process.env.PORT}`.white);
});
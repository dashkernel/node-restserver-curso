require('./config/config');
require('colors');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
// Middleware: parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Importar y usar rutas del usuario
app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('[*] Base de datos ONLINE'.green);

});

app.listen(process.env.PORT, () => {
    console.log(`[*] Escuchando puerto ${process.env.PORT}`.yellow);
});
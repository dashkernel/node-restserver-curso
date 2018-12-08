const express = require('express');
const app = express();

//Importar y usar rutas del usuario
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;
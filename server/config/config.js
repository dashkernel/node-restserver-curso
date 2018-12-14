// ========================================================
// Puerto
// ========================================================

process.env.PORT = process.env.PORT || 3000;

// ========================================================
// Entorno
// ========================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================================================
// DB
// ========================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://8.0.0.130:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ========================================================
// Vencimiento token
// ========================================================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================================
// SEED (semilla) de autenticacion
// ========================================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================================================
// Google CLIENT_ID
// ========================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '64521873687-sju839d8dmf1f0g2th62nba8qsj33t9u.apps.googleusercontent.com';
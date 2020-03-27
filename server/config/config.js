
// ===============================================
// PUERTO
// ===============================================

process.env.PORT = process.env.PORT || 3000

// ===============================================
// ENTORNO
// ===============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================================
// VENCIMIENTO DEL TOKEN
// ===============================================
// 60 seg * 60 min * 24 hr * 30 días

process.env.CADUCIDAD = 60 * 60 * 24 * 30;


// ===============================================
// SEMILLA DE AUTENTICACIÓN
// ===============================================
// 60 seg * 60 min * 24 hr * 30 días

process.env.SEMILLA = process.env.SEMILLA || 'semilla-desarrollo';


// ===============================================
// BASE DE DATOS
// ===============================================

// Declarar una variable de entorno

//heroku config:set MONGO_URI="XXXXXXX"
//heroku config:get nombre
//heroku config:unset nombre
//heroku config:set nombre="Fernando"

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ===============================================
// Google CLIENT_ID
// ===============================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '514081512674-6gjik3sf41i6olvkcct83h7icc0u8hfg.apps.googleusercontent.com';

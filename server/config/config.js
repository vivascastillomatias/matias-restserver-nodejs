
// ===============================================
// Puerto
// ===============================================

process.env.PORT = process.env.PORT || 3000

// ===============================================
// Puerto
// ===============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://admincafe:Cu6MO8zOxHwXm22d@cafe-rdtoq.gcp.mongodb.net/cafe'
}

process.env.URLDB = urlDB;
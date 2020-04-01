const express = require('express');
const app = express();
const path = require('path')

const fs = require('fs')

const { verificaToken, verificaTokenLink } = require('../middlewares/authentication.js');


app.get('/image/:tipo/:img',verificaTokenLink, (req, res) => {
    
    let noImgePath = path.resolve(__dirname,'../assets/no-image.png');
    
    let tipo = req.params.tipo;
    let img = req.params.img;
    
    let pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
    }else{
        return res.sendFile(noImgePath);
    }
})

module.exports = app;
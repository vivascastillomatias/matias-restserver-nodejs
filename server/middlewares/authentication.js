// ===============================================
// VERIFICACION DE TOKEN
// ===============================================

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next)=>{
    let token = req.get('Authorization');

    jwt.verify(token,process.env.SEMILLA,(err, decoded)=>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario
        //al instanciar next(), continúa el flujo despues de pasar por el middleware
        next();
    })
}

// ===============================================
// VERIFICACION DE TOKEN POR LINK
// ===============================================

let verificaTokenLink = (req, res, next)=>{
    let token = req.query.token

    jwt.verify(token,process.env.SEMILLA,(err, decoded)=>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario
        //al instanciar next(), continúa el flujo despues de pasar por el middleware
        next();
    })
}

// ===============================================
// VERIFICACION DE ROL ADMINISTRADOR
// ===============================================

let verificaAdminRole = (req, res, next)=>{
    let role = req.usuario.role

    if (role != 'ADMIN_ROLE') {
        return res.status(401).json({
                ok: false,
                err:{
                    message: 'El usuario no tiene permisos para realizar esta operación'
                }
            });
    }else{
        next();
    }
}



module.exports = {
    verificaToken, verificaAdminRole, verificaTokenLink
}
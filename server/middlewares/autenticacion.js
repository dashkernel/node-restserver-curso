const jwt = require('jsonwebtoken');

// ============================
// Verificar Token
// ============================
let VerificaToken = (req, res, next) => {

    let token = req.get('token'); // Authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            // console.log(process.env.SEED);
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;

        // console.log(decoded);
        //console.log(token);

        next();
    });

}


// ============================
// Verifica ADMIN_ROLE
// ============================

let VerificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    // console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

// ============================
// Verificar Token para imagenes
// ============================
let VerificaTokenImg = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            // console.log(process.env.SEED);
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });


}

module.exports = {
    VerificaToken,
    VerificaAdmin_Role,
    VerificaTokenImg
}
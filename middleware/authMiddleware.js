const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rodo1234';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];

    if(!apiKey || apiKey !== 'rodo1234'){
        return res.status(401).json({code: 401, message: 'API Key Invalida o no proporcionada'});
    }
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(403).json({code: 403, message: 'No hay token de autorización'});
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err){
            switch(err.name){
                case 'JsonWebTokenError':
                    return res.status(403).json({code: 403, message: 'Token invalido'});
                case 'TokenExpiredError':
                    return res.status(403).json({code: 403, message: 'Token expirado'});
                default:
                    return res.status(500).json({code: 500, message: 'Error interno del servidor'});    
            }
        }
        req.user = user;
        next();
    });
    }

module.exports = authenticateToken;
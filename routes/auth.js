/*
    Ruta: /api/login
*/
const { Router } = require('express'); 
const { check } = require('express-validator');

const { login,googleSignIn,renwToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const route = Router()

//Login
route.post('/',
    [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ]
    ,login
);
 

//Google
route.post('/google',
    [ 
        check('googleToken', 'El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ]
    ,googleSignIn
);
 

//Renovar Token
route.get('/renw', [validarJWT] , renwToken );
 

module.exports = route;
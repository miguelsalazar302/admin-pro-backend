/*
    Ruta: /api/login
*/
const { Router } = require('express'); 
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

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
 

module.exports = route;
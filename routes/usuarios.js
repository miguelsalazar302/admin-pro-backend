/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getUsuarios,
    creandoUsuarios,
    actualizarUsuario,
    borrarUsuario,
    getUsuariosAll
} = require('../controllers/usuarios');

const route = Router()

//Listar Usuarios
route.get('/',validarJWT,getUsuarios)

//Listar Usuarios todos
route.get('/all',validarJWT,getUsuariosAll)

//Registrar Usuario
route.post('/', 
    [ 
        check('nombre','Es requerido nombre').not().isEmpty(),
        check('password','Es requerido password').not().isEmpty(),
        check('email','Es requerido email').isEmail(),
        validarCampos
    ] 
    ,creandoUsuarios
)

//Actualizar Usuario
route.put('/:id', 
    [   
        validarJWT,
        check('nombre','Es requerido nombre').not().isEmpty(),
        check('email','Es requerido email').isEmail(),
        check('role','Es requerido role').not().isEmpty(),
        validarCampos
    ] 
    ,actualizarUsuario
)

//Borrar Usuario
route.delete('/:id',validarJWT,borrarUsuario)

module.exports = route;
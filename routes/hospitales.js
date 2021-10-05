/*
    Ruta: ./routes/hospitales
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getHospitales,
    creandoHospital,
    actualizarHospital,
    borrarHospital,
} = require('../controllers/hospitales');

const route = Router();

//Listar hospitales
route.get('/',[validarJWT],getHospitales);

//Registrar hospital
route.post('/',[
        validarJWT,
        check('nombre','El nombre del hospital es necesario...').not().isEmpty(),
        validarCampos
    ],
    creandoHospital
);

//Actualizar hospital
route.put('/:id',
    [
        validarJWT,
        check('nombre','El nombre del hospital es necesario...').not().isEmpty(),
        validarCampos
    ],
    actualizarHospital
);

//Borrar hospital
route.delete('/:id',[validarJWT],borrarHospital) 

module.exports = route;
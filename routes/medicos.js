/*
    Ruta: ./routes/medicos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getMedicos,
    creandoMedico,
    actualizarMedico,
    borrarMedico,
} = require('../controllers/medicos');

const route = Router();

//Listar medicos
route.get('/',[validarJWT],getMedicos);

//Registrar medicos
route.post('/',[
        validarJWT,
        check('nombre','El nombre del medico es necesario...').not().isEmpty(),
        check('hospital','El hospital del medico es necesario...').not().isEmpty(),
        check('hospital','El hospital no corresponde aun ID valido...').isMongoId(),
        validarCampos
    ],
    creandoMedico
);

//Actualizar medicos
route.put('/:id',[],actualizarMedico);

//Borrar medicos
route.delete('/:id',[],borrarMedico) 

module.exports = route;
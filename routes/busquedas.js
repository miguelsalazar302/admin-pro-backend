/*
    Ruta: ./api/todo/:busqueda
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getAllModels,
    getColeccionModels
} = require('../controllers/busquedas');

const route = Router();

//Listar todo
route.get('/:busqueda',[validarJWT],getAllModels);

//Listar por coleccion
route.get('/coleccion/:tabla/:busqueda',[validarJWT],getColeccionModels);


module.exports = route;
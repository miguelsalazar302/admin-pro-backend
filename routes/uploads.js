/*
    Ruta: ./api/uploads/:tipo/:id
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');

const {  
    fileUpload,
    retornarImagen
} = require('../controllers/uploads');

const route = Router();
 
// default options
route.use(expressFileUpload());

//subir archivo
route.put('/:tipo/:id',[validarJWT],fileUpload);

//Obtener foto
route.get('/:tipo/:foto',retornarImagen);


module.exports = route;
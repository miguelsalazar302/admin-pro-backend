const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async ( req, res=response )=>{ 

    const { email, password } = req.body;

    try{

        //verificar email
        const usuarioDB =  await Usuario.findOne({email:email});
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario y/o Contraseña no valida... '
            });
        }

        //verificar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if(!validPassword){
            return res.status(404).json({
                ok:false,
                msg:'Usuario y/o Contraseña no valida... '
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id )


        //Respuesta
        res.json({
            ok:true,
            usuario:usuarioDB,
            token:token
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });
    } 
}

module.exports = {
    login,
}
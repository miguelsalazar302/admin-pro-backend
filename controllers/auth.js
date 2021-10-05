const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async ( req, res=response ) =>{
    
    const { googleToken } = req.body;

    try{

        const { name, email, picture } =  await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne({email:email})

        if( !usuarioDB ){
            //Si no existe el usuario
            usuario = new Usuario({
                nombre:name,
                email:email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            //existe usuario
            usuario = usuarioDB;
            usuario.google=true;
            usuario.password='@@@';
        }

        //Guardar en base de datos
        await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id )

        //Respuesta
        res.json({
            ok:true,
            usuario,
            token
        })
    }catch(error){
        console.error(error)
        res.status(401).json({
            ok:false,
            msg:'Token no es correcto ... '
        });
    } 
}


const renwToken = async ( req, res=response ) =>{

    const uid = req.uid;

    const usuario = await Usuario.findById(uid)

    //Generar el TOKEN - JWT
    const token = await generarJWT(uid )

    //Respuesta
    res.json({
        ok:true,
        usuario,
        token
    })

}

module.exports = {
    login,
    googleSignIn,
    renwToken
}
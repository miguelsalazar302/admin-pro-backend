const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req,res)=> {
    
    const desde = Number(req.query.desde) || 0; 

    /* const usuarios= await Usuario.find({},'nombre email role google')
                                 .skip(desde)
                                 .limit(2)
    
    const total = await Usuario.count(); */

    const [usuarios,total] = await Promise.all([
        Usuario.find({},'nombre email img role google')
                    .skip(desde)
                    .limit(2),
        Usuario.count()
    ]);

    res.json({
        ok:true,
        usuarios:usuarios,
        total:total
    })
}

const getUsuariosAll = async (req,res)=> {
    
    const usuarios = await Usuario.find({},'nombre email img role google')

    res.json({
        ok:true,
        usuarios:usuarios
    })
}

const creandoUsuarios = async ( req, res=response )=> {

    const { email,password,nombre }= req.body;

    try{
        
        const existeEmail = await Usuario.findOne({ email:email });
        if(existeEmail){
            console.log('existeEmail', existeEmail);
            return res.status(400).json({
                ok:false,
                msg:'El correo ya esta registrado...'
            })
        }

        const usuario = new Usuario( req.body );

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //Guardar usuario
        await usuario.save();

        //Genero TOKE -JWT
        const token = await generarJWT(usuario.id); 

        //Respuesta
        res.json({
            ok:true,
            usuario:usuario,
            token:token
        })

    }catch( error ){

        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });

    } 
    
}

const actualizarUsuario = async ( req, res=response ) =>{

    const uid = req.params.id

    try{

        const usuarioDB = await Usuario.findById(uid); 

        if(!usuarioDB){ 
            return res.status(404).json({
                ok:false,
                msg:'Usuario no encontrado...'
            })
        }

        //Actualizar Campos
        const {password,google,email, ...campos} = req.body
        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email:req.body.email})
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con este emails...'
                })
            }
        }

        if(!usuarioDB.google){
            campos.email=email;
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new:true} );

        //Respuesta
        res.json({
            ok:true,
            usuario:usuarioActualizado
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });
    }

}

const borrarUsuario = async ( req, res=response )=>{

    const uid = req.params.id

    try{

        const usuarioDB = await Usuario.findById(uid); 

        if(!usuarioDB){ 
            return res.status(404).json({
                ok:false,
                msg:'Usuario no encontrado...'
            })
        }

        await Usuario.findByIdAndDelete( uid )

        //Respuesta
        res.json({
            ok:true,
            msj:'Usuario eliminado... '
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
    getUsuarios,
    getUsuariosAll,
    creandoUsuarios,
    actualizarUsuario,
    borrarUsuario,
}
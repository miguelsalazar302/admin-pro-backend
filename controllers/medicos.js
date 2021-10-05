const { response } = require('express'); 

const Medico = require('../models/medico')

const getMedicos = async (req,res)=> {
    
    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');

    res.json({
        ok:true,
        medico:medicos
    })
}

const creandoMedico = async ( req, res=response )=> {

    const uid=req.uid; 
    const medico = new Medico({
        usuario:uid,
        hospital:req.body.hospital,
        ...req.body
    });

    try{ 

        const medicoDB = await medico.save();

        res.json({
            ok:true,
            medico:medicoDB
        })

    }catch( error ){

        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });

    } 
    
}

const actualizarMedico = async ( req, res=response ) =>{

    try{
       
        //Respuesta
        res.json({
            ok:true,
            medico:[]
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });
    }

}

const borrarMedico = async ( req, res=response )=>{
 

    try{
 
        //Respuesta
        res.json({
            ok:true,
            msj:'Medico eliminado... '
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
    getMedicos,
    creandoMedico,
    actualizarMedico,
    borrarMedico,
}
const { response } = require('express'); 

const Hospital = require('../models/hospital')

const getHospitales = async (req,res)=> {
    
    const hospitales = await Hospital.find().populate('usuario','nombre img')

    res.json({
        ok:true,
        hospital:hospitales
    })
}

const creandoHospital = async ( req, res=response )=> {

    const uid=req.uid;
    const hospital = new Hospital({
        usuario:uid,
        ...req.body
    });

    try{ 

       const hospitalDB = await hospital.save();

        res.json({
            ok:true,
            hospital: hospitalDB
        })

    }catch( error ){

        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });

    } 
    
}

const actualizarHospital = async ( req, res=response ) =>{

    try{
       
        //Respuesta
        res.json({
            ok:true,
            hospital:[]
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... '
        });
    }

}

const borrarHospital = async ( req, res=response )=>{
 

    try{
 
        //Respuesta
        res.json({
            ok:true,
            msj:'Hospital eliminado... '
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
    getHospitales,
    creandoHospital,
    actualizarHospital,
    borrarHospital,
}
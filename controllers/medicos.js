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

    const id = req.params.id;
    const uid = req.uid;

    try{

        const  medico = await Medico.findById(id);

        if( !medico ){
            return res.status(404).json({
                ok:false,
                msg:'Medico no encontrato por el id... '
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
        
        const medicoDB = await Medico.findByIdAndUpdate(id,cambiosMedico,{new:true});

        //Respuesta
        res.json({
            ok:true,
            medico:medicoDB
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
 
    const id = req.params.id;

    try{

        const  medico = await Medico.findById(id);

        if( !medico ){
            return res.status(404).json({
                ok:false,
                msg:'Medico no encontrato por el id... '
            });
        }

         await Medico.findByIdAndDelete(id);

        //Respuesta
        res.json({
            ok:true,
            msg:'Medico eliminado ...'
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
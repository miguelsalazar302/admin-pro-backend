const { response } = require('express'); 

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getAllModels = async (req,res)=> {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda,'i');
    
    /* const usuario = await Usuario.find({nombre:regex});
    const medico = await Medico.find({nombre:regex});
    const hospital = await Hospital.find({nombre:regex}); */

    const [usuario,medico,hospital] = await Promise.all([
        Usuario.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Hospital.find({nombre:regex})
    ])

    res.json({
        ok:true,
        usuarios:usuario,
        medicos:medico,
        hospitales:hospital
    })
}

const getColeccionModels = async (req,res)=> {

    const busqueda = req.params.busqueda;
    const colecion = req.params.tabla;
    const regex = new RegExp( busqueda,'i');
    let data;

    switch (colecion){
        case 'hospitales':
            data = await Hospital.find({nombre:regex})
                                 .populate('usuario','nombre img');
            break;
        case 'medicos':
            data = await Medico.find({nombre:regex})
                               .populate('usuario','nombre img')
                               .populate('hospital','nombre img')
            break;
        case 'usuarios':
            data = await Usuario.find({nombre:regex})
                                .populate('usuario','nombre img');
            break;
        default:
            return res.status(400).json({
                ok:false,
                msg:'La tabla tiene que ser usuarios/medicos/hospitales'
            });
            break;
    }

    res.json({
        ok:true,
        resultados:data
    })
}
 

module.exports = {
    getAllModels,
    getColeccionModels
}
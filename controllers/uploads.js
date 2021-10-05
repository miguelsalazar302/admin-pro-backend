const path = require('path');
const fs = require('fs');
const { response } = require('express'); 
const { v4: uuidv4 } = require('uuid');
const { actualizarArchivo } = require('../helpers/actualizar-archivo');

const fileUpload = async (req,res=response)=> {

    const tipo = req.params.tipo;
    const id = req.params.id;
    
    const tiposValidos = ['hospitales','medicos','usuarios'];

    if(!tiposValidos.includes(tipo)){
        return res.status(500).json({
            ok:false,
            msg:'No es un médico, usuario u hospital (tipo) ... '
        });
    }

    //validar que existe el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No hay ningun archivo ... '
        });
    }

    //Procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1];

    //Validar extension
    const extensionValidas = ['png','jpg','jpge','gif'];

    if(!extensionValidas.includes(extensionArchivo)){
        return res.status(500).json({
            ok:false,
            msg:'No es una extension permitida ... '
        });
    }   

    //Generar nonbre del archivo
    const nombreArchivo = uuidv4()+'.'+extensionArchivo;

    //Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen ... '
            });
        }
        
        actualizarArchivo( tipo, id, nombreArchivo );

        res.json({
            ok:true,
            msg:'Archivo subido',
            nombreArchivo:nombreArchivo
        })

    });

    
}
 
const retornarImagen = async (req,res=response)=> {

    const tipo = req.params.tipo;
    const foto = req.params.foto;
    let pathImg;

    pathImg= path.join(__dirname,`../uploads/${tipo}/${foto}`);
    


    // imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        pathImg= path.join(__dirname,`../uploads/picture-page-not-found.jpg`);
        res.sendFile(pathImg);
    }
    
 
}

module.exports = {
    fileUpload,
    retornarImagen 
}
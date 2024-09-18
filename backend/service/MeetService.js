const moment = require('moment-timezone')
const path = require('path');
const fs = require('fs');
const meetRepository = require('../persistance/MeetRepository')
const Utils = require("../utils/Utils");

const MeetService = {}


MeetService.save = async function (meet) {
    const {meetUrl, product, image} = meet; // Incluye la imagen en la destructuración

    let meetDate;
    if (meet.meetDate) {
        // Crear una instancia de Date para asegurar el formato correcto
        const parsedDate = new Date(meet.meetDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Formato de fecha inválido')
        }
        // Convertir a formato ISO para que moment pueda analizarlo correctamente
        meetDate = moment.tz(parsedDate.toISOString(), 'GMT').set({second: 0, millisecond: 0}).toDate();
    } else {
        throw new Error('Fecha no proporcionada');
    }

    // Definir la carpeta donde se guardarán las imágenes
    const imagesDir = path.join(__dirname, '../uploads/images');

    // Asegurarse de que la carpeta existe
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, {recursive: true});
    }

    let imagePath = null;

    // Guardar la imagen si se proporciona
    if (image) {
        const imageName = `${Date.now()}-${image.originalname}`;
        imagePath = path.join(imagesDir, imageName);

        // Escribir la imagen en el sistema de archivos
        fs.writeFileSync(imagePath, image.buffer);

        // La ruta que se guarda en la base de datos debe ser relativa o accesible para el cliente
        imagePath = `/uploads/images/${imageName}`;
    }

    // Crear el registro en la base de datos
    return await meetRepository.create({
        meetUrl: meetUrl,
        meetDate: meetDate,
        price: product.price,
        name: product.name,
        description: product.description,
        stripeCode: product.stripeCode,
        imagePath: imagePath, // Guardar la ruta de la imagen en la base de datos
        active: true
    });
};


MeetService.getAll = async function () {
    return await meetRepository.findAll({
        where: {
            active: true // Solo traer los registros donde 'active' sea true
        }
    })
}

MeetService.getOne = async function (id) {
    return await meetRepository.findByPk(id)
}

MeetService.update = async function (id, meet) {
    await meetRepository.update(meet, {
        where: {
            id: id
        }
    })

    return await meetRepository.findByPk(id)
}

// MeetService.delete = async function (id){
//     await meetRepository.destroy({
//         where: {
//             id: id
//         }
//     })
// }

MeetService.getByUrl = async function (url) {
    return await meetRepository.findOne({
        where: {
            meetUrl: url
        }
    })
}

module.exports = MeetService
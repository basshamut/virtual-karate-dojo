const moment = require('moment-timezone')
const meetRepository = require('../persistance/MeetRepository')

const MeetService = {}

MeetService.save = async function (meet) {
    const { meetUrl, product, imageUrl } = meet; // Usamos `imageUrl` de Cloudinary

    let meetDate;
    if (meet.meetDate) {
        const parsedDate = new Date(meet.meetDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Formato de fecha inválido');
        }
        meetDate = moment.tz(parsedDate.toISOString(), 'GMT').set({ second: 0, millisecond: 0 }).toDate();
    } else {
        throw new Error('Fecha no proporcionada');
    }

    // Crear el registro en la base de datos
    return await meetRepository.create({
        meetUrl: meetUrl,
        meetDate: meetDate,
        price: product.price,
        name: product.name,
        description: product.description,
        stripeCode: product.stripeCode,
        imagePath: imageUrl, // Guardar la URL de la imagen de Cloudinary
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
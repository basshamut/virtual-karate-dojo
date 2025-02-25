const express = require("express")
const multer = require('multer');
const stream = require("stream");

const meetService = require('../service/MeetService')
const cloudinarySettings = require("../config/cloudinary/CloudinaryConfig")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router()

router.post('/', upload.single('image'), async (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    const meet = {
        meetUrl: request.body.meetUrl,
        meetDate: request.body.meetDate,
        product: JSON.parse(request.body.product),
        image: request.file // La imagen subida
    };

    try {
        // Usar una promesa para manejar el upload_stream
        const uploadImageToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(request.file.buffer);

                const cloudinaryUploadStream = cloudinarySettings.getSettings().uploader.upload_stream(
                    { folder: 'karate-classes' },
                    (error, result) => {
                        if (error) {
                            return reject(new Error('Error al subir la imagen a Cloudinary: ' + error.message));
                        }
                        resolve(result);
                    }
                );

                bufferStream.pipe(cloudinaryUploadStream);
            });
        };

        // Subir la imagen y obtener el resultado
        const cloudinaryResult = await uploadImageToCloudinary();

        // Añadir la URL de la imagen de Cloudinary al objeto meet
        meet.imageUrl = cloudinaryResult.secure_url;

        // Guardar la reunión usando el servicio
        const newMeet = await meetService.save(meet);
        response.status(201).send(newMeet);
    } catch (error) {
        console.error('Error al guardar la reunión:', error);
        response.status(500).send({ error: 'Error al guardar la reunión' });
    }
});

router.get('/', async (request, response) => {
    const url = request.query.url

    if (!url) {
        response.status(400).send({ message: 'Url parameter is required' })
        return
    }

    const meet = await meetService.getByUrl(url)
    if (meet) {
        response.status(200).send(meet)
    } else {
        response.status(404).send({ message: 'Meet not found' })
    }
})

router.get('/all', async (request, response) => {
    const meets = await meetService.getAll()
    response.status(200).send(meets)
})

module.exports = router

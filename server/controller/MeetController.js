const express = require("express")
const meetService = require('../service/MeetService')

const router = express.Router()

router.post('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    const meet = {
        meetUrl: request.body.meetUrl,
        meetDate: request.body.meetDate
    }

    const newMeet = meetService.save(meet)

    response.status(201).send(newMeet)
})

router.get('/', async (request, response) => {
    const url = request.query.url

    if (!url) {
        response.status(400).send({message: 'Url parameter is required'})
        return
    }

    const meet = await meetService.getByUrl(url)
    if (meet) {
        response.status(200).send(meet)
    } else {
        response.status(404).send({message: 'Meet not found'})
    }
})
router.get('/all', async (request, response) => {
    const meets = await meetService.getAll()
    response.status(200).send(meets)
})

module.exports = router
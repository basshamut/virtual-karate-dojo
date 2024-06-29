const express = require("express")
const meetService = require('../service/MeetService')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Meet:
 *       type: object
 *       required:
 *         - meetUrl
 *         - meetDate
 *         - price
 *       properties:
 *         meetUrl:
 *           type: string
 *           description: URL of the meet
 *         meetDate:
 *           type: string
 *           format: date-time
 *           description: Date of the meet
 *         price:
 *           type: number
 *           description: Price of the meet
 *       example:
 *         meetUrl: http://meet.example.com
 *         meetDate: 2023-06-01T14:00:00Z
 *         price: 99.99
 */

/**
 * @swagger
 * /api/meets:
 *   post:
 *     summary: Create a new meet
 *     tags: [Meets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meet'
 *     responses:
 *       201:
 *         description: Meet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meet'
 */
router.post('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    const meet = {
        meetUrl: request.body.meetUrl,
        meetDate: request.body.meetDate,
        price: request.body.price
    }

    const newMeet = meetService.save(meet)

    response.status(201).send(newMeet)
})

/**
 * @swagger
 * /api/meets:
 *   get:
 *     summary: Get a meet by URL
 *     tags: [Meets]
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: URL of the meet
 *     responses:
 *       200:
 *         description: Meet found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meet'
 *       400:
 *         description: URL parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Url parameter is required
 *       404:
 *         description: Meet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Meet not found
 */
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

/**
 * @swagger
 * /api/meets/all:
 *   get:
 *     summary: Get all meets
 *     tags: [Meets]
 *     responses:
 *       200:
 *         description: List of all meets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meet'
 */
router.get('/all', async (request, response) => {
    const meets = await meetService.getAll()
    response.status(200).send(meets)
})

module.exports = router

const express = require("express");
const router = express.Router();

const PurchaseService = require("../service/PurchaseService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Purchase:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product being purchased
 *         quantity:
 *           type: integer
 *           description: Quantity of the product being purchased
 *         price:
 *           type: number
 *           description: Price of the purchase
 *       example:
 *         productId: "12345"
 *         quantity: 2
 *         price: 19.99
 * paths:
 *   /api/purchases/:
 *     get:
 *       summary: Get list of purchases
 *       description: Retrieve a list of all purchases with details such as email, birth date, purchase date, meet date, and price.
 *       tags:
 *         - Purchases
 *       responses:
 *         '200':
 *           description: A list of purchases
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: test@test.com
 *                       description: Email of the purchaser.
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       example: 01/01/2000
 *                       description: Birth date of the purchaser.
 *                     purchaseDate:
 *                       type: string
 *                       format: date
 *                       example: 01/01/2021
 *                       description: Date of the purchase.
 *                     meetDate:
 *                       type: string
 *                       format: date
 *                       example: 01/01/2021
 *                       description: Date when the purchaser and vendor met.
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 15
 *                       description: Price of the purchase.
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 *   /api/purchases:
 *     post:
 *       summary: Create a new purchase
 *       tags: [Purchases]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       responses:
 *         '200':
 *           description: Purchase created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Purchase'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error message
 *       security:
 *         - basicAuth: []
 */
router.post('/', async (req, res) => {
    try {
        const purchase = req.body;
        const savedPurchase = await PurchaseService.save(purchase);
        res.json(savedPurchase);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const purchases = [
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'test@test.com',
                birthDate: '01/01/2000',
                purchaseDate: '01/01/2021',
                meetDate: '01/01/2021',
                price: 15
            },
            {
                email: 'jane@test.com',
                birthDate: '05/05/1998',
                purchaseDate: '02/02/2022',
                meetDate: '01/01/2021',
                price: 15
            }
        ]
        res.json(purchases);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;

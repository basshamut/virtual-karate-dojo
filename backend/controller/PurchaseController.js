const express = require("express");
const router = express.Router();

const PurchaseService = require("../service/PurchaseService");
const Utils = require("../utils/Utils");
const mailerService = require("../service/MailerService");

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
 *       description: Retrieve a list of all purchases with optional filters by date.
 *       tags: [Purchases]
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: int32
 *           required: false
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: int32
 *           required: false
 *           description: Limit
 *         - in: query
 *           name: startDate
 *           schema:
 *             type: string
 *             format: date
 *           required: false
 *           description: Filter purchases from this start date (inclusive).
 *         - in: query
 *           name: endDate
 *           schema:
 *             type: string
 *             format: date
 *           required: false
 *           description: Filter purchases up to this end date (inclusive).
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
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        const { totalItems, totalPages, currentPage, itemsPerPage, purchases } = await PurchaseService.getPaginatedPurchases(page, limit, startDate, endDate);

        const paginationInfo = {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        };

        res.json({
            paginationInfo,
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

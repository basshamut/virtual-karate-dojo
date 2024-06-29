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
 */

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Create a new purchase
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Purchase'
 *     responses:
 *       200:
 *         description: Purchase created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchase'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 *     security:
 *       - basicAuth: []
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

module.exports = router;

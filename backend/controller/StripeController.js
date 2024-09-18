const express = require("express");
const MeetService = require("../service/MeetService");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const domain = process.env.FRONTEND_URL;

/**
 * @swagger
 * components:
 *   schemas:
 *     CheckoutSession:
 *       type: object
 *       required:
 *         - meetId
 *         - userId
 *       properties:
 *         meetId:
 *           type: string
 *           description: ID of the meeting
 *         userId:
 *           type: string
 *           description: ID of the user
 *       example:
 *         meetId: "meet123"
 *         userId: "user456"
 */

/**
 * @swagger
 * /api/stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutSession'
 *     responses:
 *       200:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   description: ID of the created session
 *                   example: "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *     security:
 *       - basicAuth: []
 */
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { meetId, userId } = req.body;
        const meet = await MeetService.getOne(meetId)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: meet.stripeCode,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domain}/dojo/dashboard?state=succeeded&meetId=${meetId}&userId=${userId}`,
            cancel_url: `${domain}/dojo/dashboard?state=canceled&meetId=${meetId}&userId=${userId}`,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const express = require("express");
const MeetService = require("../service/MeetService");
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const domain = process.env.FRONTEND_URL;


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

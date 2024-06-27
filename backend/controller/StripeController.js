const express = require("express")
const router = express.Router()

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// const domain = "http://localhost:5173"
// const domain = "http://86.38.204.61"
const domain = process.env.FRONTEND_URL

router.post('/create-checkout-session', async (req, res) => {
    //TODO encriptar y parsear a bse64 datos del retorno de la respuesta
    try {
        const meetId = req.body.meetId
        const userId = req.body.userId
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1PSI1tKnVUk9u0R7xH1FCwss',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: domain + '/virtual-dojo/frontend/dashboard?state=succeeded&meetId=' + meetId + '&userId=' + userId,
            cancel_url:  domain + '/virtual-dojo/frontend/dashboard?state=canceled&meetId=' + meetId + '&userId=' + userId,
        })

        res.json({sessionId: session.id})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router
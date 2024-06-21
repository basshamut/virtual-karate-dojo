require('dotenv').config();

const express = require("express");
const cors = require('cors');

const meetController = require('./controller/MeetController');
const sequelize = require("./config/database/database");

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/meets', meetController);

app.get('/', (request, response) => {
    response.status(200).json({
        message: "Service is up!"
    });
});

const stripe = require('stripe')('sk_test_51PSHknKnVUk9u0R7NE00UeVyiOzpnfGxGYnLG6ViHxy2eOpDXfYCQTU28Xnfuh9MPvg7qwi5hQp4ArEBjJhjv73z005BOmZJSK');

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1PSI1tKnVUk9u0R7xH1FCwss',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/dashboard?state=succeeded',
            cancel_url: 'http://localhost:5173/dashboard?state=canceled'
        });

        console.log(session)

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(port, async function () {
    console.log("  ➜  Local: Server Listening on port " + port + " (http://localhost:" + port + ")");
    try {
        await sequelize.authenticate();
        sequelize.sync({force: true})  // force: true elimina las tablas existentes y las vuelve a crear, usa con precaución
            .then(() => {
                console.log('Database & tables created!');
            })
            .catch(error => {
                console.error('Unable to create tables, shutting down...', error);
            });
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

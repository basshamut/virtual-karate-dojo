require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors')

const meetController = require('./controller/MeetController')
const stripeController = require('./controller/StripeController')
const userController = require('./controller/UserController')
const purchaseController = require('./controller/PurchaseController')
const authenticateInterceptorMiddleware = require('./interceptor/AuthenticateInterceptorMiddleware');

const port = process.env.PORT ? process.env.PORT : 5000

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(authenticateInterceptorMiddleware)

app.use('/api/meets', meetController)
app.use('/api/users', userController)
app.use('/api/stripe', stripeController)
app.use('/api/purchases', purchaseController)


app.get('/', (request, response) => {
    response.status(200).json({
        message: "Service is up!"
    })
})

app.listen(port, async function () {
    console.log("  ➜  Local: Server Listening on port " + port + " (http://localhost:" + port + ")")
})

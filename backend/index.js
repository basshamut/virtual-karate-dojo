require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swagger/swagger');

const app = express();
require('./schedule/MeetSchedule');
const meetController = require('./controller/MeetController');
const stripeController = require('./controller/StripeController');
const userController = require('./controller/UserController');
const purchaseController = require('./controller/PurchaseController');
const authenticateInterceptorMiddleware = require('./interceptor/AuthenticateInterceptorMiddleware');

const port = process.env.PORT ? process.env.PORT : 5000;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

setupSwagger(app);

// Aplicar el middleware de autenticación solo a las rutas de la API
app.use('/api/meets', authenticateInterceptorMiddleware, meetController);
app.use('/api/users', authenticateInterceptorMiddleware, userController);
app.use('/api/stripe', authenticateInterceptorMiddleware, stripeController);
app.use('/api/purchases', authenticateInterceptorMiddleware, purchaseController);

app.get('/', (request, response) => {
    response.status(200).json({
        message: "Service is up!"
    });
});

app.listen(port, async function () {
    console.log("  ➜  Local: Server Listening on port " + port + " (http://localhost:" + port + ")");
});

require('dotenv').config();

const express = require("express");
const cors = require('cors');

const meetController = require('./controller/MeetController');

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

app.listen(port, function(){
    console.log("Listening on port " + port);
});

const express = require("express");
const meetService = require('../service/MeetService');

const router = express.Router();

router.post('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    const meet = {
        meetUrl: request.body.meetUrl
    };

    const newMeet = meetService.save(meet);

    response.status(201).send(newMeet);
});

module.exports = router;
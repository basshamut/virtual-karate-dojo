const meetRepository = require('../persistance/MeetRepository')

const MeetService = {}

MeetService.save = function (meet){
    const newMeet = {
        id: meetRepository.length + 1,
        meetUrl: meet.meetUrl
    }

    meetRepository.push(newMeet)

    return newMeet
}

module.exports = MeetService
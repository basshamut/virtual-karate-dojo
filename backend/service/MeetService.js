const moment = require('moment-timezone')
const meetRepository = require('../persistance/MeetRepository')

const MeetService = {}

MeetService.save = async function (meet) {
    const meetDate = moment.tz(meet.meetDate, 'GMT').set({ second: 0, millisecond: 0 }).toDate()

    return await meetRepository.create({
        meetUrl: meet.meetUrl,
        meetDate: meetDate,
        price: meet.price
    })
}
MeetService.getAll = async function (){
    return await meetRepository.findAll()
}

MeetService.getOne = async function (id){
    return await meetRepository.findByPk(id)
}

MeetService.update = async function (id, meet){
    await meetRepository.update(meet, {
        where: {
            id: id
        }
    })

    return await meetRepository.findByPk(id)
}

MeetService.delete = async function (id){
    await meetRepository.destroy({
        where: {
            id: id
        }
    })
}

MeetService.getByUrl = async function (url){
    return await meetRepository.findOne({
        where: {
            meetUrl: url
        }
    })
}

module.exports = MeetService
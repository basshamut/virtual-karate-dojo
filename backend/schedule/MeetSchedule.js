const cron = require('node-cron')
const {Op} = require('sequelize')
const moment = require('moment-timezone')
const meetRepository = require('../persistance/MeetRepository')
const purchaseRepository = require('../persistance/PurchaseRepository')
const userRepository = require('../persistance/UserRepository')
const mailerService = require('../service/MailerService')

const MeetSchedule = {}

MeetSchedule.deleteOldMeets = cron.schedule('0 0 * * *', async () => {
    try {
        const result = await meetRepository.update(
            {active: false}, // Establecer el campo 'active' a false
            {
                where: {
                    meetDate: {
                        [Op.lt]: new Date()
                    }
                }
            }
        );

        console.log(`Se actualizaron ${result[0]} registros.`); // 'result[0]' contiene el número de filas afectadas
    } catch (err) {
        console.error('Error al actualizar registros:', err);
    }
});

MeetSchedule.sendMeets = cron.schedule('0 * * * *', async () => {
    try {
        const now = moment().tz('GMT')
        const currentHour = now.clone().set({second: 0, millisecond: 0})
        const nextHour = now.clone().add(1, 'hours').set({second: 0, millisecond: 0})

        const meets = await meetRepository.findAll({
            where: {
                meetDate: {
                    [Op.gte]: currentHour.toDate(),
                    [Op.lte]: nextHour.toDate()
                }
            }
        })

        console.log(`Entre las ${currentHour.format('HH:mm')} y las ${nextHour.format('HH:mm')} se encontraron ${meets.length} registros.`)

        for (const meet of meets) {
            const purchases = await purchaseRepository.findAll({
                where: {
                    meetId: meet.id
                },
                include: [userRepository]
            })

            for (const purchase of purchases) {
                const user = purchase.User
                await mailerService.sendMail(
                    user.email,
                    'Link: Clase Karate Budo Online',
                    'Link para la clase de Karate Budo Online: ' + meet.meetUrl,
                    'Link para la clase de Karate Budo Online: ' + meet.meetUrl,
                    null
                )

                console.log(`Notificación enviada a: ${user.email}`)
            }

            //Eliminamos los meets ya enviados
            await meetRepository.update(
                {active: false},
                {
                    where: {
                        id: meet.id
                    }
                })
        }

    } catch (err) {
        console.error('Error al buscar registros:', err)
    }
})

module.exports = MeetSchedule

const cron = require('node-cron');
const { Op } = require('sequelize');
const meetRepository = require('../persistance/MeetRepository');

const MeetSchedule = {};

MeetSchedule.deleteOldMeets = cron.schedule('0 0 * * *', async () => {
    try {
        const result = await meetRepository.destroy({
            where: {
                meetDate: {
                    [Op.lt]: new Date()
                }
            }
        });

        console.log(`Se eliminaron ${result} registros.`); // result es el número de registros eliminados
    } catch (err) {
        console.error('Error al eliminar registros:', err);
    }
});

// Iniciar el schedule inmediatamente al importar el módulo
MeetSchedule.deleteOldMeets.start();

module.exports = MeetSchedule;
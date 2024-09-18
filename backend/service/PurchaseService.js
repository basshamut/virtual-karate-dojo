const purchaseRepository = require('../persistance/PurchaseRepository');
const meetRepository = require('../persistance/MeetRepository');
const userRepository = require("../persistance/UserRepository");
const {Op} = require('sequelize');
const mailerService = require("./MailerService");
const PurchaseService = {};

PurchaseService.save = async function (purchase) {
    const meet = await meetRepository.findByPk(purchase.meetId);
    const user = await userRepository.findByPk(purchase.userId);
    const purchaseCreated =  await purchaseRepository.create({
        userId: user.id,
        meetId: meet.id,
        price: meet.price,
        purchaseDate: new Date(),
        active: true
    });

    await mailerService.sendInvoice(user,meet, purchaseCreated)

    return purchaseCreated;
};

PurchaseService.getPaginatedPurchases = async function (page = 1, limit = 10, startDate = null, endDate = null) {
    const offset = (page - 1) * limit;

    // Crear el objeto de filtrado por fecha si se proporcionan fechas válidas
    const whereConditions = {};

    if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0); // 00:00:00.000

        // Aplicar el filtro sobre la tabla Meet
        whereConditions['$Meet.meetDate$'] = {[Op.gte]: startOfDay};
    }

    if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999); // 23:59:59.999

        // Aplicar el filtro sobre la tabla Meet
        whereConditions['$Meet.meetDate$'] = {
            ...whereConditions['$Meet.meetDate$'],
            [Op.lte]: endOfDay
        };
    }

    // Consultar las compras con los filtros de fecha sobre Meet.meetDate, paginación y contar el total de registros
    const {count, rows: purchases} = await purchaseRepository.findAndCountAll({
        where: whereConditions, // Filtrar por las fechas en la tabla Meet
        include: [
            {model: userRepository, attributes: ['id', 'email']},
            {model: meetRepository, attributes: ['id', 'meetDate']}
        ],
        offset: offset,
        limit: limit,
        order: [['purchaseDate', 'DESC']], // Ordenar por fecha de compra descendente
    });

    // Calcular la información de paginación
    const totalPages = Math.ceil(count / limit);

    return {
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
        purchases: purchases,
    };
};

module.exports = PurchaseService;

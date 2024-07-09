const format = require('date-fns/format');
const purchaseRepository = require('../persistance/PurchaseRepository')
const meetRepository = require('../persistance/MeetRepository')
const userRepository = require("../persistance/UserRepository");
const mailerService = require('./MailerService')
const invoiceMakerService = require('./InvoiceMakerService')
const PurchaseService = {}

PurchaseService.save = async function (purchase) {
    const meet = await meetRepository.findByPk(purchase.meetId)
    const user = await userRepository.findByPk(purchase.userId)
    const newPurchase = await purchaseRepository.create({
        userId: user.id,
        meetId: meet.id,
        price: meet.price,
        purchaseDate: new Date()
    })

    const dataForPdf = {
        id: newPurchase.id,
        purchaseDate: format(newPurchase.purchaseDate, 'dd/MM/yyyy HH:mm'),
        price: meet.price,
        items: [
            {product: "Clase de Karate", quantity: 1, cost: meet.price}
        ]
    }

    const invoicePdf = await invoiceMakerService.generateInvoicePdf(dataForPdf)
    await mailerService.sendMail(
        user.email,
        'Purchase confirmation',
        'Your purchase has been processed',
        'Your purchase has been processed',
        invoicePdf)

    return newPurchase
}

module.exports = PurchaseService
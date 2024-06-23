const purchaseRepository = require('../persistance/PurchaseRepository')
const MeetRepository = require('../persistance/MeetRepository')
const UserRepository = require("../persistance/UserRepository");
const PurchaseService = {}

PurchaseService.save = async function (purchase) {
    const meet = await MeetRepository.findByPk(purchase.meetId)
    const user = await UserRepository.findByPk(purchase.userId)
    return await purchaseRepository.create({
        userId: user.id,
        meetId: meet.id,
        price: meet.price,
        purchaseDate: new Date()
    })
}

module.exports = PurchaseService
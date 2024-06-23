const express = require("express")
const router = express.Router()

const PurchaseService = require("../service/PurchaseService");
router.post('/', async (req, res) => {
    try {
        const purchase = req.body;
        const savedPurchase = await PurchaseService.save(purchase);
        res.json(savedPurchase);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router
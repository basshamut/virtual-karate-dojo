const express = require("express");
const router = express.Router();

const PurchaseService = require("../service/PurchaseService");
const Utils = require("../utils/Utils");
const mailerService = require("../service/MailerService");

router.post('/', async (req, res) => {
    try {
        const purchase = req.body;
        const savedPurchase = await PurchaseService.save(purchase);
        res.json(savedPurchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

        const { totalItems, totalPages, currentPage, itemsPerPage, purchases } = await PurchaseService.getPaginatedPurchases(page, limit, startDate, endDate);

        const paginationInfo = {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        };

        res.json({
            paginationInfo,
            data: purchases
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

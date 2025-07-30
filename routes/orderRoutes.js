const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

// Get all bills for the logged-in user
router.get('/', verifyToken, orderController.getUserBills);

// Get items in a specific bill
router.get('/:billId', verifyToken, orderController.getBillItems);

module.exports = router;

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const verifyToken = require('../middleware/authMiddleware');

// Protected routes for address
router.post('/address', verifyToken, deliveryController.addOrUpdateAddress);
router.get('/address', verifyToken, deliveryController.getAddress);

module.exports = router;

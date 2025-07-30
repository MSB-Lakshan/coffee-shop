const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public route to get all products
router.get('/', productController.getAllProducts);

module.exports = router;

//after the step1 of this
const verifyToken = require('../middleware/authMiddleware');

router.post('/buy/:id', verifyToken, productController.buyProduct);

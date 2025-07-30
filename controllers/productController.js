const db = require('../db');

// Get all products
exports.getAllProducts = (req, res) => {
  const query = 'SELECT product_id, product_name, quantity_available, price FROM products';

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error fetching products.' });
    }

    return res.status(200).json(results);
  });
};

//after the step 1 of this script
const jwt = require('jsonwebtoken');

exports.buyProduct = (req, res) => {
  const userId = req.userId;  // from JWT middleware
  const productId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity.' });
  }

  // Step 1: Check product availability
  const checkProductQuery = 'SELECT quantity_available, price FROM products WHERE product_id = ?';
  db.query(checkProductQuery, [productId], (err, productResult) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (productResult.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = productResult[0];

    if (product.quantity_available < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available.' });
    }

    // Step 2: Decrease product quantity
    const newQuantity = product.quantity_available - quantity;
    const updateProductQuery = 'UPDATE products SET quantity_available = ? WHERE product_id = ?';
    db.query(updateProductQuery, [newQuantity, productId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating product quantity.' });

      // Step 3: Create bill and bill items
      const billId = 'BILL' + Date.now(); // simple unique bill ID
      const createBillQuery = 'INSERT INTO bills (user_id, bill_id, payment_status) VALUES (?, ?, ?)';
      db.query(createBillQuery, [userId, billId, 'pending'], (err) => {
        if (err) return res.status(500).json({ message: 'Error creating bill.' });

        const createBillItemQuery = 'INSERT INTO bill_items (bill_id, product_id, quantity) VALUES (?, ?, ?)';
        db.query(createBillItemQuery, [billId, productId, quantity], (err) => {
          if (err) return res.status(500).json({ message: 'Error adding bill items.' });

          return res.status(200).json({ message: 'Purchase successful.', billId });
        });
      });
    });
  });
};

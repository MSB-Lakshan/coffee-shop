const db = require('../db');

// Get all bills of the user
exports.getUserBills = (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT id, bill_id, date, payment_status
    FROM bills
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error fetching bills.' });

    return res.status(200).json(results);
  });
};

// Get items in a specific bill
exports.getBillItems = (req, res) => {
  const billId = req.params.billId;

  const query = `
    SELECT p.product_name, p.price, b.quantity
    FROM bill_items b
    JOIN products p ON b.product_id = p.product_id
    WHERE b.bill_id = ?
  `;

  db.query(query, [billId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching bill items.' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No items found for this bill.' });
    }

    return res.status(200).json(results);
  });
};

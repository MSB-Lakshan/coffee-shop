const db = require('../db');

// Add or Update delivery address for logged-in user
exports.addOrUpdateAddress = (req, res) => {
  const userId = req.userId;
  const { address, state, postal_code } = req.body;

  if (!address || !state || !postal_code) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Check if user already has an address
  const checkQuery = 'SELECT * FROM user_location WHERE user_id = ?';
  db.query(checkQuery, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (result.length > 0) {
      // Update existing address
      const updateQuery = 'UPDATE user_location SET address = ?, state = ?, postal_code = ? WHERE user_id = ?';
      db.query(updateQuery, [address, state, postal_code, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating address.' });

        return res.status(200).json({ message: 'Address updated successfully.' });
      });
    } else {
      // Insert new address
      const insertQuery = 'INSERT INTO user_location (user_id, address, state, postal_code) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [userId, address, state, postal_code], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding address.' });

        return res.status(201).json({ message: 'Address added successfully.' });
      });
    }
  });
};

// Get delivery address of logged-in user
exports.getAddress = (req, res) => {
  const userId = req.userId;

  const query = 'SELECT address, state, postal_code FROM user_location WHERE user_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    return res.status(200).json(result[0]);
  });
};

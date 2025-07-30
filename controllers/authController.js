// controllers/authController.js
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Check if all fields are filled
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const userData = [name, email, mobile, hashedPassword];
    db.query(
      'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)',
      userData,
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error saving user.' });

        return res.status(201).json({ message: 'User registered successfully.' });
      }
    );
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  // Find user
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error.' });

    if (result.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const user = result[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Optional: Update login status in DB
    db.query('UPDATE users SET login_status = 1 WHERE id = ?', [user.id]);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      userId: user.id,
      name: user.name,
    });
  });
};

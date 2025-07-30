const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.headers['authorization'];

  // If no token found
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user ID to request for later use
    req.userId = decoded.id;

    // Allow request to continue
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;

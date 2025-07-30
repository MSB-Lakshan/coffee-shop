const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('☕ Coffee Shop API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const verifyToken = require('./middleware/authMiddleware');

app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: `Hello user ${req.userId}, you're authorized.` });
});


const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Register Delivery Routes
const deliveryRoutes = require('./routes/deliveryRoutes');
app.use('/api/delivery', deliveryRoutes);


const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const authenticateJWT = require('./middleware/auth');
const restaurantRoutes = require('./routes/restaurants');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Auth routes (e.g., login, signup)
app.use('/api/auth', authRoutes);

// Protected restaurant routes
app.use('/api/restaurants', authenticateJWT, restaurantRoutes);

// Example of a protected route
app.get('/api/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is a protected route.', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

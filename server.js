const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config();    // wczyt z .env
const app = express();
app.use(express.json());

connectDB();

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Coś poszło nie tak' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
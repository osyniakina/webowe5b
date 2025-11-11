const express = require('express');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

// const connectDB = require('./config/db');

const PORT = process.env.PORT || 8080;

dotenv.config();    
const app = express();
app.use(express.json());

// connectDB();

app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error' });
});

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));
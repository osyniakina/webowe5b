import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';  // so front can call api
import AuthController from './controllers/authController.js';
import MovieController from './controllers/movieController.js';
import connectDB from './db.js';
import { auth } from './middleware/authMiddleware.js';

config();

// const mongoose = require('mongoose');

const app = express();
app.use(json());

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CLIENT_URL || '*' })); //allow req from front

const authController = new AuthController();
const movieController = new MovieController();

connectDB();

app.use('/movies', auth, movieController.router);
app.use('/auth', authController.router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error' });
});

app.get("/", (req, res) => {
  res.send("Hello from server");
});


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`));
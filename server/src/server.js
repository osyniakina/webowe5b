import express, { json } from 'express';
import { config } from 'dotenv';
import AuthController from './controllers/authController.js';
import MovieController from './controllers/movieController.js';
import connectDB from './db.js';

config();

// const mongoose = require('mongoose');


const PORT = process.env.PORT || 8080;

const authController = new AuthController();
const movieController = new MovieController();
    
const app = express();
app.use(json());

connectDB();

app.use('/movies', movieController.router);
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
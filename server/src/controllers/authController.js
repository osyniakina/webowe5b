import User from '../models/modelUser.js';
import { hash, compare } from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";


export default class AuthController {
  constructor() {
    this.router = Router();

    this.router.post('/register', this.registerUser.bind(this));
    this.router.post('/login', this.loginUser.bind(this));
  }


  async registerUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: "Email already in use" });

      const hashedPassword = await hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ message: "User registered", token });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) return res.status(400).json({ error: "Invalid input" });

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "User not found" });

      const isMatch = await compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: "Wrong password" });

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: "Logged in", token });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}






import User from '../models/modelUser.js';
import { hash, compare } from "bcryptjs";
import { Router } from "express";


export default class AuthController {
  constructor() {
    this.router = Router();

    this.router.post('/register', this.registerUser.bind(this));
    this.router.post('/login', this.loginUser.bind(this));
  }


  async registerUser(req, res) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword
      });

      await newUser.save();
      res.status(201).json({ message: "User registered" });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "User not found" });

      const isMatch = await compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Wrong password " });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}






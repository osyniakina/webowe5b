const User = require('../models/modelUser');
const bcrypt = require("bcryptjs");


exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password " });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model("User", userSchema);
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' }
});

export default model("User", userSchema);
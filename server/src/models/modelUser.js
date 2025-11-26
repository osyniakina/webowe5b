import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' }
});

export default model("Users", userSchema, "Users");  
import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  director: String,
  year: Number,
  description: String,
  genre: String
});

export default model("Movie", movieSchema, "Movies");
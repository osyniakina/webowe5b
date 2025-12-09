import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  director: String,
  year: String,
  description: String,
  genre: String
});

export default model("Movie", movieSchema, "Movies");
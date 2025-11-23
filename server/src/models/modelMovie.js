import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  title: { type: String, required: true },
  director: String,
  year: Number,
  description: String,
  genres: [String]
});

export default model("Movie", movieSchema);
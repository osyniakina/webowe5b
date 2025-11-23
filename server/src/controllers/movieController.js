import Movie from '../models/modelMovie.js';
import { Router } from "express";

export default class MovieController {
  constructor() {
    this.router = Router();

    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:id", this.getById.bind(this));
    this.router.post("/", this.create.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.remove.bind(this));
  }

  async getAll(req, res) {
    try {
      const movies = await Movie.find().sort({ createdAt: -1 });
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ error: 'Not found' });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  
  async create(req, res) {
    try {
      const newMovie = new Movie(req.body);
      const saved = await newMovie.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}





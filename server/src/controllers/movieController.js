import { auth, requireRole } from "../middleware/authMiddleware.js";
import Movie from '../models/modelMovie.js';
import MovieService from '../services/movieService.js';
import { Router } from "express";
import jwt from "jsonwebtoken";

export default class MovieController {
  constructor() {
    this.router = Router();
    this.movieService = new MovieService(Movie);

    this.router.get("/", auth, this.getAll.bind(this));
    this.router.get("/:id", auth, this.getById.bind(this));
    this.router.post("/", auth, requireRole("admin"), this.create.bind(this));
    this.router.put("/:id", auth, requireRole("admin"), this.update.bind(this));
    this.router.delete("/:id", auth, requireRole("admin"), this.remove.bind(this));
  }

  async getAll(req, res) {
    try {
      const movies = await this.movieService.getAllMovies();
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const movie = await this.movieService.getMovieById(req.params.id);
      if (!movie) return res.status(404).json({ error: 'Not found' });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const { title, director, year, description, genre } = req.body;

      if (!title || !director || !year || !description || !genre) {
        return res.status(400).json({ error: "Data required" });
      }

      const newMovie = await this.movieService.createMovie({ title, director, year, description, genre });

      res.status(201).json({ message: "Movie added", movie: newMovie });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await this.movieService.updateMovie(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async remove(req, res) {
    try {
      await this.movieService.deleteMovie(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}


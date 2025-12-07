export default class MovieService {
    constructor(movieModel) {
        this.movieModel = movieModel;
    }

    async createMovie(data) {
        const movie = new this.movieModel(data);
        return await movie.save();
    }

    async getAllMovies() {
        return await this.movieModel.find().sort({ createdAt: -1 });
    }

    async getMovieById(id) {
        return await this.movieModel.findById(id);
    }

    escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    async searchMovies(title) {
        if (!title) return await this.getAllMovies();
        const safe = this.escapeRegex(title);
        const regex = new RegExp(safe, 'i');
        return await this.movieModel.find({ title: regex }).sort({ createdAt: -1 });
    }

    async updateMovie(id, data) {
        return await this.movieModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMovie(id) {
        return await this.movieModel.findByIdAndDelete(id);
    }
}
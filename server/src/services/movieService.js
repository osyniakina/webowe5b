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

    async searchMovies(title) {
        if (!title) return await this.getAllMovies();
        const regex = new RegExp(title, 'i');
        return await this.movieModel.find({ title: regex }).sort({ createdAt: -1 });
    }

    async updateMovie(id, data) {
        return await this.movieModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMovie(id) {
        return await this.movieModel.findByIdAndDelete(id);
    }
}
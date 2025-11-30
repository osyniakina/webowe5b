import { getMovies, addMovie } from "../api/movies";
import { useEffect, useState } from "react";

export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({ title: "", director: "", year: 0, description: "", genre: "" });

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        const data = await getMovies();
        setMovies(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addMovie(form);
        setForm({ title: "", director: "", year: 0, description: "", genre: "" });
        loadMovies();
    };

    return (
        <div style={{ padding: 40 }}>

            <h1> Movies</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                    placeholder="Director"
                    value={form.director}
                    onChange={(e) => setForm({ ...form, director: e.target.value })}
                />
                <input
                    placeholder="Year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                />
                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <label htmlFor="genres">Choose a genre:</label>
                <select id="genres" name="genres" value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                    <option value="Przygoda">Przygoda</option>
                    <option value="Komedia">Komedia</option>
                    <option value="Horror">Horror</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Triller">Triller</option>
                    <option value="Romantyka">Romantyka</option>
                    <option value="Dokument">Dokument</option>
                    <option value="Fantastyka">Fantastyka</option>
                </select>
                <button type="submit">Add</button>
            </form>


            <ul>
                {movies.map((m) => (
                    <li key={m._id}>
                        {m.title} — {m.director} ({m.year}) {m.genre}<br />
                        {m.description}
                    </li>
                ))}
            </ul>
        </div>);
};

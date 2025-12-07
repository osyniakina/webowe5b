import { getMovies, addMovie } from "../api/movies";
import { useEffect, useState } from "react";

export default function Movies({ setIsAuth }) {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({
        title: "",
        director: "",
        year: "",
        description: "",
        genre: "Przygoda"
    });
    const [error, setError] = useState("");

    useEffect(() => {
        loadMovies();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        if (typeof setIsAuth === "function") setIsAuth(false);
    };

    const loadMovies = async () => {
        try {
            const data = await getMovies();
            setMovies(data || []);
        } catch (err) {
            console.error("Load movies error:", err);
            setError(err.message || "Cannot load movies");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title || !form.director || !form.year || !form.description || !form.genre) {
            setError("Wypełnij wszystkie pola");
            return;
        }

        const yearNumber = Number(form.year);
        if (!Number.isInteger(yearNumber) || yearNumber <= 0) {
            setError("Podaj poprawny rok (liczba całkowita > 0)");
            return;
        }

        try {
            await addMovie({
                title: form.title,
                director: form.director,
                year: yearNumber,
                description: form.description,
                genre: form.genre,
            });

            setForm({ title: "", director: "", year: "", description: "", genre: "Przygoda" });
            await loadMovies();

        } catch (err) {
            console.error("Add movie error:", err);
            setError(err.message || "Błąd podczas dodawania filmu");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <button onClick={logout} style={{ float: "left" }}>Logout</button>
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
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <label htmlFor="genres">Choose a genre:</label>
                <select
                    id="genres"
                    name="genres"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                >
                    <option value="Przygoda">Przygoda</option>
                    <option value="Komedia">Komedia</option>
                    <option value="Horror">Horror</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Triller">Triller</option>
                    <option value="Romantyka">Romantyka</option>
                    <option value="Dokument">Dokument</option>
                    <option value="Fantastyka">Fantastyka</option>
                </select>

                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}

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
        </div>
    );
};
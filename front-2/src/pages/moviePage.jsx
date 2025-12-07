import { getMovies, searchMovies, addMovie, updateMovie, deleteMovie } from "../api/movies";
import { useEffect, useState } from "react";

export default function Movies({ setIsAuth, role }) {
    const isAdmin = role === "admin";

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ title: "", director: "", year: "", description: "", genre: "Przygoda" });
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [isSending, setIsSending] = useState(false);

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
            setError(err.message || "Cannot load movies");
        }
    };

    const handleSearch = async (e) => {
        const v = e.target.value;
        setSearch(v);
        try {
            if (!v) {
                await loadMovies();
            } else {
                const data = await searchMovies(v);
                setMovies(data || []);
            }
        } catch (err) {
            setError(err.message || "Search failed");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError("");
        if (!isAdmin) return setError("Brak uprawnień");

        if (!form.title || !form.director || !form.year || !form.description || !form.genre) {
            setError("Wypełnij wszystkie pola");
            return;
        }
        const yearNumber = Number(form.year);
        if (!Number.isInteger(yearNumber) || yearNumber <= 0) {
            setError("Podaj poprawny rok");
            return;
        }

        try {
            setIsSending(true);
            await addMovie({ ...form, year: yearNumber });
            setForm({ title: "", director: "", year: "", description: "", genre: "Przygoda" });
            await loadMovies();
        } catch (err) {
            setError(err.message || "Add failed");
        } finally {
            setIsSending(false);
        }
    };

    const openEdit = (movie) => {
        setEditingMovie({ ...movie });
        setIsEditing(true);
        setError("");
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingMovie((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        if (!isAdmin) return setError("Brak uprawnień");
        if (!editingMovie.title || !editingMovie.director || !editingMovie.year || !editingMovie.description || !editingMovie.genre) {
            setError("Wypełnij wszystkie pola");
            return;
        }
        const yearNumber = Number(editingMovie.year);
        if (!Number.isInteger(yearNumber) || yearNumber <= 0) {
            setError("Podaj poprawny rok");
            return;
        }

        try {
            setIsSending(true);
            await updateMovie(editingMovie._id, {
                title: editingMovie.title,
                director: editingMovie.director,
                year: yearNumber,
                description: editingMovie.description,
                genre: editingMovie.genre
            });
            setIsEditing(false);
            setEditingMovie(null);
            await loadMovies();
        } catch (err) {
            setError(err.message || "Update failed");
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isAdmin) {
            setError("Brak uprawnień");
            return;
        }
        const ok = window.confirm("Are you sure you want to delete this movie?");
        if (!ok) return;
        try {
            await deleteMovie(id);
            await loadMovies();
        } catch (err) {
            setError(err.message || "Delete failed");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <h1 style={{ margin: 0 }}>Movies</h1>
                    <div>
                        <input
                            placeholder="Search by title..."
                            value={search}
                            onChange={handleSearch}
                            style={{ padding: 6 }}
                        />
                    </div>
                </div>

                <div>
                    <span style={{ marginRight: 12 }}>{role}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            {isAdmin && (
                <form onSubmit={handleAdd} style={{ marginTop: 16, marginBottom: 24 }}>
                    <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <input placeholder="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} />
                    <input placeholder="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                    <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                        <option value="Przygoda">Przygoda</option>
                        <option value="Komedia">Komedia</option>
                        <option value="Horror">Horror</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Triller">Triller</option>
                        <option value="Romantyka">Romantyka</option>
                        <option value="Dokument">Dokument</option>
                        <option value="Fantastyka">Fantastyka</option>
                    </select>
                    <button type="submit" disabled={isSending}>{isSending ? "Please wait..." : "Add"}</button>
                </form>
            )}

            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

            <ul>
                {movies.map((m) => (
                    <li key={m._id} style={{ marginBottom: 12 }}>
                        <strong>{m.title}</strong> — {m.director} ({m.year}) <em>{m.genre}</em>
                        <div>{m.description}</div>

                        {isAdmin && (
                            <div style={{ marginTop: 6 }}>
                                <button onClick={() => openEdit(m)} style={{ marginRight: 8 }}>Edit</button>
                                <button onClick={() => handleDelete(m._id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Edit modal (simple) */}
            {isEditing && editingMovie && (
                <div style={{
                    position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 9999
                }}>
                    <div style={{ background: "#fff", padding: 20, minWidth: 320 }}>
                        <h3>Edit movie</h3>
                        <input name="title" value={editingMovie.title} onChange={handleEditChange} />
                        <input name="director" value={editingMovie.director} onChange={handleEditChange} />
                        <input name="year" type="number" value={editingMovie.year} onChange={handleEditChange} />
                        <input name="description" value={editingMovie.description} onChange={handleEditChange} />
                        <select name="genre" value={editingMovie.genre} onChange={handleEditChange}>
                            <option value="Przygoda">Przygoda</option>
                            <option value="Komedia">Komedia</option>
                            <option value="Horror">Horror</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Triller">Triller</option>
                            <option value="Romantyka">Romantyka</option>
                            <option value="Dokument">Dokument</option>
                            <option value="Fantastyka">Fantastyka</option>
                        </select>

                        <div style={{ marginTop: 12 }}>
                            <button onClick={saveEdit} disabled={isSending}>{isSending ? "Saving..." : "Save"}</button>
                            <button onClick={() => { setIsEditing(false); setEditingMovie(null); }} style={{ marginLeft: 8 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { getMovies, searchMovies, addMovie, updateMovie, deleteMovie } from "../api/movies";
import { useEffect, useState } from "react";

export default function Movies({ setIsAuth, role }) {
    const isAdmin = role === "admin";

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ title: "", director: "", year: "", description: "", genre: "Przygoda", imageUrl: "" });
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const [genreFilter, setGenreFilter] = useState("");
    // const [sortBy, setSortBy] = useState(""); // "" | "title" | "year"
    const genres = [
        "Przygoda", "Detektyw", "Komedia", "Horror", "Kryminal",
        "Fantasy", "Triller", "Romantyka", "Dokument", "Fantastyka"
    ];

    const [detailMovie, setDetailMovie] = useState(null);

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

    const handleSearchChange = async (e) => {
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
            setForm({ title: "", director: "", year: "", description: "", genre: "Przygoda", imageUrl: "" });
            await loadMovies();
        } catch (err) {
            setError(err.message || "Add failed");
        } finally {
            setIsSending(false);
        }
    };


    const openEdit = (movie) => {
        setEditingMovie({ ...movie, year: String(movie.year), imageUrl: movie.imageUrl || "" });
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
        const ok = window.confirm("Czy na pewno chcesz usunąć ten film?");
        if (!ok) return;
        try {
            await deleteMovie(id);
            await loadMovies();
        } catch (err) {
            setError(err.message || "Delete failed");
        }
    };

    //  detail view (page-like modal)
    const openDetail = (movie) => {
        setDetailMovie(movie);
    };

    const closeDetail = () => {
        setDetailMovie(null);
    };


    const handleGenreChange = (e) => {
        setGenreFilter(e.target.value);
    };


    const displayedMovies = (() => {
        let list = Array.isArray(movies) ? [...movies] : [];

        // filter by genre
        if (genreFilter) {
            list = list.filter(m => m.genre === genreFilter);
        }
        if (list.length === 0) {
            return {
                items: [],
                message: "No movies found."
            };
        }

        return {
            items: list,
            message: null
        };

    })();


    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <h1 style={{ margin: 0 }}>Movies</h1>

                    <input
                        placeholder="Search by title..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ padding: 6, margin: 6 }}
                    />

                    <select value={genreFilter} onChange={handleGenreChange} style={{ padding: 6 }}>
                        <option value="">Wszystkie gatunki</option>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: 6 }}>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            {/* Admin form */}
            {isAdmin && (
                <form onSubmit={handleAdd} style={{ marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <input placeholder="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} />
                    <input placeholder="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                    <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                        <option value="Przygoda">Przygoda</option>
                        <option value="Detektyw">Detektyw</option>
                        <option value="Komedia">Komedia</option>
                        <option value="Horror">Horror</option>
                        <option value="Kryminal">Kryminal</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Triller">Triller</option>
                        <option value="Romantyka">Romantyka</option>
                        <option value="Dokument">Dokument</option>
                        <option value="Fantastyka">Fantastyka</option>
                    </select>
                    <button type="submit" disabled={isSending}>{isSending ? "Please wait..." : "Add"}</button>
                </form>
            )}

            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

            {/* Content: admin - controls; user - blocks */}
            {isAdmin ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {displayedMovies.message && (
                        <div style={{
                            textAlign: "center",
                            padding: 20,
                            color: "#191818ff",
                            fontSize: 18
                        }}>
                            {displayedMovies.message}
                        </div>
                    )}
                    {displayedMovies.items.map((m) => (
                        <li key={m._id} style={{ marginBottom: 12, padding: 10, border: "1px solid #eee", borderRadius: 6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{m.title}</strong> — {m.director} ({m.year}) <em style={{ color: "#666" }}>{m.genre}</em>
                                    <div style={{ marginTop: 6 }}>{m.description}</div>
                                </div>
                                <div>
                                    <button onClick={() => openEdit(m)} style={{ marginRight: 8, marginBottom: 8 }}>Edit</button>
                                    <button onClick={() => handleDelete(m._id)}>Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // user view
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                    gap: 12
                }}>
                    {displayedMovies.message && (
                        <div style={{
                            textAlign: "center",
                            padding: 20,
                            color: "#777",
                            fontSize: 18
                        }}>
                            {displayedMovies.message}
                        </div>
                    )}
                    {displayedMovies.items.map((m) => (
                        <div key={m._id}
                            onClick={() => openDetail(m)}
                            style={{
                                cursor: "pointer",
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                padding: 12,
                                color: "#131313ff",
                                textAlign: "center",
                                background: "#fafafa",
                                minHeight: 80,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <img src={"/film-slate.png"} style={{ width: "70%", height: "auto", borderRadius: 4, marginBottom: 8 }} />
                            <div style={{ fontWeight: 600 }}>{m.title}</div>
                            <div style={{ color: "#666", marginTop: 6 }}>{m.year}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit modal for admin */}
            {isEditing && editingMovie && (
                <div style={{
                    position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 9999
                }}>
                    <div style={{ background: "#fff", color: "black", padding: 20, minWidth: 320, borderRadius: 6 }}>
                        <h3>Edit movie</h3>
                        <input name="title" value={editingMovie.title} onChange={handleEditChange} placeholder="Title" />
                        <input name="director" value={editingMovie.director} onChange={handleEditChange} placeholder="Director" />
                        <input name="year" type="number" value={editingMovie.year} onChange={handleEditChange} placeholder="Year" />
                        <input name="description" value={editingMovie.description} onChange={handleEditChange} placeholder="Description" />
                        <select name="genre" value={editingMovie.genre} onChange={handleEditChange}>
                            <option value="Przygoda">Przygoda</option>
                            <option value="Detektyw">Detektyw</option>
                            <option value="Komedia">Komedia</option>
                            <option value="Horror">Horror</option>
                            <option value="Kryminal">Kryminal</option>
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

            {/* Detail page/modal for user (and for admin on click too) */}
            {detailMovie && (
                <div style={{
                    position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.7)", color: "black", display: "flex", alignItems: "center",
                    justifyContent: "center", zIndex: 9999, padding: 20
                }}>
                    <div style={{ background: "#fff", padding: 20, maxWidth: 900, width: "100%", borderRadius: 8, display: "flex", gap: 16 }}>
                        <div style={{ flex: "0 0 40%" }}>
                            <img src={"/film-slate.png"} alt={detailMovie.title} style={{ width: "60%", height: "auto", borderRadius: 6, paddingTop: 15 }} />
                        </div>
                        <div style={{ flex: "1 1 50%", overflowY: "auto" }}>
                            <h2 style={{ marginTop: 0 }}>{detailMovie.title}</h2>
                            <div style={{ color: "#666", marginBottom: 8 }}>{detailMovie.director} — {detailMovie.year} • <em>{detailMovie.genre}</em></div>
                            <p>{detailMovie.description}</p>

                            <div style={{ marginTop: 12, display: "flex", gap: 8, alignContent: "center" }}>
                                <button onClick={closeDetail} >Close</button>
                                {isAdmin && <button onClick={() => { closeDetail(); openEdit(detailMovie); }}>Edit</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
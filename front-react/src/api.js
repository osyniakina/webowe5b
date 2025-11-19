const API_URL = "/api/movies";

export const getMovies = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const addMovie = async (movie) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie)
  });
  return res.json();
};
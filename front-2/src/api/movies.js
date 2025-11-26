const API_URL = "http://localhost:5000/movies";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${user.token || ""}`
  };
};

export const getMovies = async () => {
  const res = await fetch(API_URL, {
    headers: getAuthHeader()
  });
  return res.json();
};

export const addMovie = async (movie) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(movie)
  });
  return res.json();
};
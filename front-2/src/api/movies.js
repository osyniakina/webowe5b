const API_URL = "http://localhost:5000/movies";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token || ""}`
  };
};

const authFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (res.status === 204) {
      return null;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || res.statusText || "Request failed");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const getMovies = async () => {
  return await authFetch(API_URL);
};

export const searchMovies = async (title) => {
  const q = title ? `?title=${encodeURIComponent(title)}` : "";
  return await authFetch(`${API_URL}/search${q}`);
};

export const addMovie = async (movie) => {
  return await authFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(movie),
  });
};

export const updateMovie = async (id, movie) => {
  return await authFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(movie),
  });
};

export const deleteMovie = async (id) => {
  return await authFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

const API_URL = "http://localhost:5000/auth";

export async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const e = await response.json().catch(() => null);
            throw new Error(e?.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.token) {
            const payload = parseJwt(result.token);
            localStorage.setItem("token", result.token);
            if (payload.role) localStorage.setItem("role", payload.role);
            if (payload.email) localStorage.setItem("email", payload.email);
        }
        return result;
    } catch (err) {
        throw err;
    }
}


export async function login(userData) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const e = await response.json().catch(() => null);
            throw new Error(e?.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.token) {
            const payload = parseJwt(result.token);
            localStorage.setItem("token", result.token);
            if (payload.role) localStorage.setItem("role", payload.role);
            if (payload.email) localStorage.setItem("email", payload.email);
        }
        return result;
    } catch (err) {
        throw err;
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
}


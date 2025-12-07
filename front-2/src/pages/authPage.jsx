import { login, register } from "../api/auth";
import { useState } from "react";

export default function AuthPage({ setIsAuth }) {
	const [mode, setMode] = useState("register");
	const [dataState, setDataState] = useState({ email: "", password: "" });
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDataState((prev) => ({ ...prev, [name]: value }));
	};

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		if (isSending) return;
		setIsSending(true);

		try {
			if (mode === "register") {
				await register(dataState);
			} else {
				await login(dataState);
			}
			// success: mark as authenticated and show movies
			if (typeof setIsAuth === "function") setIsAuth(true);
		} catch (err) {
			setError(err.message || "Request failed");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div style={{ maxWidth: 420 }}>
			<h2>{mode === "register" ? "Register" : "Login"}</h2>

			<form onSubmit={submit}>
				<div style={{ marginBottom: 8 }}>
					<input
						name="email"
						type="email"
						placeholder="Email"
						value={dataState.email}
						onChange={handleInputChange}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				<div style={{ marginBottom: 8 }}>
					<input
						name="password"
						type="password"
						placeholder="Password (min 6 chars)"
						value={dataState.password}
						onChange={handleInputChange}
						required
						minLength={6}
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				{error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

				<div style={{ display: "flex", gap: 8 }}>
					<button type="submit" disabled={isSending}>
						{isSending ? "Please wait..." : (mode === "register" ? "Register" : "Login")}
					</button>
					<button
						type="button"
						onClick={() => setMode(mode === "register" ? "login" : "register")}
					>
						{mode === "register" ? "Go to Login" : "Go to Register"}
					</button>
				</div>
			</form>
		</div>
	);
}
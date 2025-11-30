import { login } from "../api/auth";
import { useState } from "react";

export default function Auth(){
	const [dataState, setDataState] = useState({
		email: '',
		password: '',
	});

	const [formState, setFormState] = useState({
		isSending: false,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setDataState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); // блокуємо стандартну поведінку

		try {
			if (formState.isSending) {
				return;
			}
			setFormState((prev) => ({
				...prev,
				isSending: true,
			}));
			await login(dataState);
        }
        finally {
			setFormState((prev) => ({
				...prev,
				isSending: false,
			}));
		}
};

	return (
		<form onSubmit={void handleSubmit}>
			<h2 >Sign In</h2>

			<div >
				<input
					name="email"
					value={dataState.email}
					onChange={handleInputChange}
				/>
			</div>
			<div >
				<input
					name="password"
					placeholder="Password"
					type="password"
					value={dataState.password}
					onChange={handleInputChange}
				/>
			</div>

			<div>
				<button
					type="submit"
					
				>Login</button>
			</div>
		</form>
	);
};

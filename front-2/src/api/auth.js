
export async function login(userData) {

    try {

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        console.log('Відповідь від сервера:', result);
    } catch (err) {
        console.error('Помилка при запиті:', err);
    }
};
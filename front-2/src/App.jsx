import { useEffect, useState } from 'react'
import './App.css';
import AuthPage from './pages/authPage';
import MoviePage from './pages/moviePage';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsAuth(Boolean(token));
    setRole(storedRole || null);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      {isAuth
        ? <MoviePage setIsAuth={setIsAuth} role={role} />
        : <AuthPage setIsAuth={setIsAuth} setRole={setRole} />
      }
    </div>
  );
}

export default App;

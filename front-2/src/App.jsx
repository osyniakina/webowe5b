import { useEffect, useState } from 'react'
import './App.css';
import AuthPage from './pages/authPage';
import MoviePage from './pages/moviePage';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(Boolean(token));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      {isAuth ? <MoviePage setIsAuth={setIsAuth} /> : <AuthPage setIsAuth={setIsAuth} />}
    </div>
  );
}

export default App;

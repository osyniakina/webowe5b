import { useEffect, useState } from 'react'
import './App.css';
import AuthPage from './pages/authPage';
import MoviePage from './pages/moviePage';


function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);



  return (
    <div style={{ padding: 40 }}>
      <AuthPage />
      {isAuth ? <MoviePage /> : <AuthPage />
      }
    </div>
  );
}

export default App

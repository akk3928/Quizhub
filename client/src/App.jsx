import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Quizzes from './pages/Quizzes.jsx';
import TakeQuiz from './pages/TakeQuiz.jsx';
import History from './pages/History.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand">QuizHub</Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/">Quizzes</Link>
              <Link to="/history">My Scores</Link>
              <span className="muted">Hi, {user.name}</span>
              <button className="btn small ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<Protected><Quizzes /></Protected>} />
          <Route path="/quiz/:id" element={<Protected><TakeQuiz /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

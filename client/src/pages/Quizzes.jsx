import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/quizzes').then(setQuizzes).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!quizzes) return <p className="center">Loading quizzes…</p>;
  if (!quizzes.length) return <p className="center">No quizzes yet. Run <code>npm run seed</code> on the server.</p>;

  return (
    <>
      <h1>Available quizzes</h1>
      <div className="grid">
        {quizzes.map((q) => (
          <div className="card" key={q.id}>
            <span className="tag">{q.category}</span>
            <h3>{q.title}</h3>
            <p className="muted">{q.description}</p>
            <p className="muted">{q.questionCount} questions · {q.timeLimitMinutes} min</p>
            <Link className="btn" to={`/quiz/${q.id}`}>Start quiz</Link>
          </div>
        ))}
      </div>
    </>
  );
}

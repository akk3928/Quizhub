import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function History() {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/attempts/mine').then(setAttempts).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!attempts) return <p className="center">Loading…</p>;
  if (!attempts.length) return <p className="center">You haven't attempted any quizzes yet.</p>;

  const best = Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100)));
  const avg = Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length);

  return (
    <>
      <h1>My score history</h1>
      <div className="stats">
        <div className="card stat"><b>{attempts.length}</b><span>Attempts</span></div>
        <div className="card stat"><b>{avg}%</b><span>Average</span></div>
        <div className="card stat"><b>{best}%</b><span>Best</span></div>
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Quiz</th><th>Category</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
          <tbody>
            {attempts.map((a) => (
              <tr key={a.id}>
                <td>{a.quizTitle}</td>
                <td>{a.category}</td>
                <td>{a.score} / {a.total}</td>
                <td>{Math.round((a.score / a.total) * 100)}%</td>
                <td>{new Date(a.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

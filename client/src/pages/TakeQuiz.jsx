import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';

export default function TakeQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);

  useEffect(() => {
    api(`/quizzes/${id}`)
      .then((q) => {
        setQuiz(q);
        setAnswers(Array(q.questions.length).fill(null));
        setSecondsLeft(q.timeLimitMinutes * 60);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = useCallback(async (finalAnswers) => {
    if (submitted.current) return;
    submitted.current = true;
    setSubmitting(true);
    try {
      setResult(await api('/attempts', { method: 'POST', body: { quizId: id, answers: finalAnswers } }));
    } catch (e) {
      submitted.current = false;
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }, [id]);

  // Countdown; auto-submit when time runs out
  const answersRef = useRef(answers);
  answersRef.current = answers;
  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) { submit(answersRef.current); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, result, submit]);

  if (error) return <p className="error">{error}</p>;
  if (!quiz) return <p className="center">Loading…</p>;

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="card">
        <h1>Result: {result.score} / {result.total} ({pct}%)</h1>
        <div className="review">
          {result.review.map((r, i) => (
            <div key={i} className="q">
              <p><strong>{i + 1}. {r.text}</strong></p>
              {r.options.map((o, j) => {
                let cls = 'opt';
                if (j === r.correctIndex) cls += ' correct';
                else if (j === r.selectedIndex) cls += ' wrong';
                return <div key={j} className={cls}>{o}{j === r.selectedIndex ? '  (your answer)' : ''}</div>;
              })}
              {r.selectedIndex === null && <p className="muted">Not answered</p>}
            </div>
          ))}
        </div>
        <div className="row">
          <Link className="btn" to="/">More quizzes</Link>
          <Link className="btn ghost" to="/history">Score history</Link>
        </div>
      </div>
    );
  }

  const q = quiz.questions[current];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const answered = answers.filter((a) => a !== null).length;
  const isLast = current === quiz.questions.length - 1;

  return (
    <div className="card">
      <div className="row between">
        <h2>{quiz.title}</h2>
        <span className={`timer ${secondsLeft < 30 ? 'danger' : ''}`}>{mm}:{ss}</span>
      </div>
      <p className="muted">Question {current + 1} of {quiz.questions.length} · {answered} answered</p>
      <h3>{q.text}</h3>
      <div className="options">
        {q.options.map((o, i) => (
          <button
            key={i}
            className={`opt btn-opt ${answers[current] === i ? 'selected' : ''}`}
            onClick={() => setAnswers((a) => a.map((v, k) => (k === current ? i : v)))}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="row between">
        <button className="btn ghost" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button>
        {isLast ? (
          <button className="btn" disabled={submitting} onClick={() => submit(answers)}>
            {submitting ? 'Submitting…' : 'Submit quiz'}
          </button>
        ) : (
          <button className="btn" onClick={() => setCurrent(current + 1)}>Next</button>
        )}
      </div>
    </div>
  );
}

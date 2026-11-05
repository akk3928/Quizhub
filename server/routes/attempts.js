const router = require('express').Router();
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// Grade on the server so answers can't be tampered with
router.post('/', auth, async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (!Array.isArray(answers)) return res.status(400).json({ message: 'answers must be an array' });

    const clean = quiz.questions.map((_, i) => {
      const a = answers[i];
      return Number.isInteger(a) ? a : null;
    });
    const score = quiz.questions.reduce((s, q, i) => s + (clean[i] === q.correctIndex ? 1 : 0), 0);

    const attempt = await Attempt.create({
      user: req.userId, quiz: quiz._id, score, total: quiz.questions.length, answers: clean,
    });
    res.status(201).json({
      id: attempt._id, score, total: quiz.questions.length,
      review: quiz.questions.map((q, i) => ({
        text: q.text, options: q.options, correctIndex: q.correctIndex, selectedIndex: clean[i],
      })),
    });
  } catch (e) { next(e); }
});

// Score history for the logged-in user
router.get('/mine', auth, async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.userId }).sort({ createdAt: -1 }).populate('quiz', 'title category');
    res.json(attempts.map((a) => ({
      id: a._id, quizTitle: a.quiz ? a.quiz.title : '(deleted quiz)', category: a.quiz?.category,
      score: a.score, total: a.total, date: a.createdAt,
    })));
  } catch (e) { next(e); }
});

module.exports = router;

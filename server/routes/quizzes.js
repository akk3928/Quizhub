const router = require('express').Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// List quizzes (no questions)
router.get('/', auth, async (_req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes.map((q) => ({
      id: q._id, title: q.title, description: q.description, category: q.category,
      timeLimitMinutes: q.timeLimitMinutes, questionCount: q.questions.length,
    })));
  } catch (e) { next(e); }
});

// One quiz — correct answers are NOT sent to the client
router.get('/:id', auth, async (req, res, next) => {
  try {
    const q = await Quiz.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Quiz not found' });
    res.json({
      id: q._id, title: q.title, description: q.description, timeLimitMinutes: q.timeLimitMinutes,
      questions: q.questions.map((x) => ({ id: x._id, text: x.text, options: x.options })),
    });
  } catch (e) { next(e); }
});

module.exports = router;

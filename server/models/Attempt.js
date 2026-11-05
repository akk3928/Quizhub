const mongoose = require('mongoose');

module.exports = mongoose.model('Attempt', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [{ type: Number, default: null }],
}, { timestamps: true }));

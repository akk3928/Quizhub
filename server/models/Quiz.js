const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], validate: (v) => v.length >= 2 },
  correctIndex: { type: Number, required: true },
});

module.exports = mongoose.model('Quiz', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'General' },
  timeLimitMinutes: { type: Number, default: 5 },
  questions: [questionSchema],
}, { timestamps: true }));

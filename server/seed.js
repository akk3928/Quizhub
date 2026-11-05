require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

const quizzes = [
  {
    title: 'JavaScript Basics', category: 'Programming', timeLimitMinutes: 5,
    description: 'Core JavaScript concepts.',
    questions: [
      { text: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'define', 'static'], correctIndex: 1 },
      { text: 'What does typeof null return?', options: ['"null"', '"undefined"', '"object"', '"number"'], correctIndex: 2 },
      { text: 'Which method adds an item to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctIndex: 0 },
      { text: 'What does === check?', options: ['Value only', 'Type only', 'Value and type', 'Reference only'], correctIndex: 2 },
      { text: 'Which is NOT a JavaScript data type?', options: ['Symbol', 'Boolean', 'Float', 'BigInt'], correctIndex: 2 },
    ],
  },
  {
    title: 'MERN Stack Fundamentals', category: 'Web Development', timeLimitMinutes: 5,
    description: 'MongoDB, Express, React and Node.',
    questions: [
      { text: 'What does the "M" in MERN stand for?', options: ['MySQL', 'MongoDB', 'Mongoose', 'Middleware'], correctIndex: 1 },
      { text: 'Which library is commonly used to model MongoDB data in Node?', options: ['Sequelize', 'Mongoose', 'Prisma', 'Knex'], correctIndex: 1 },
      { text: 'Which React hook manages local component state?', options: ['useEffect', 'useRef', 'useState', 'useMemo'], correctIndex: 2 },
      { text: 'Express is primarily a...', options: ['Database', 'Web framework for Node.js', 'CSS framework', 'Testing tool'], correctIndex: 1 },
      { text: 'What does JWT stand for?', options: ['JavaScript Web Token', 'JSON Web Token', 'Java Web Transfer', 'JSON Window Tool'], correctIndex: 1 },
    ],
  },
  {
    title: 'General Knowledge', category: 'General', timeLimitMinutes: 4,
    description: 'A quick mixed quiz.',
    questions: [
      { text: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correctIndex: 1 },
      { text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Mercury'], correctIndex: 2 },
      { text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
      { text: 'Which gas do plants absorb from the air?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], correctIndex: 1 },
    ],
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Quiz.insertMany(quizzes);
  console.log(`Seeded ${quizzes.length} quizzes`);
  await mongoose.disconnect();
})();

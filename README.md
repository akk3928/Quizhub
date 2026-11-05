# QuizHub — Online Quiz System (MERN)

User login, timed quiz attempts, server-side grading, and score history.

## Run locally
```bash
# Backend
cd server
cp .env.example .env      # fill MONGO_URI and JWT_SECRET
npm install
npm run seed              # loads sample quizzes
npm run dev               # http://localhost:5000

# Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

## API
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Current user |
| GET | /api/quizzes | List quizzes |
| GET | /api/quizzes/:id | Quiz questions (no answers) |
| POST | /api/attempts | Submit answers, graded server-side |
| GET | /api/attempts/mine | Score history |

## Deploy
- Database: MongoDB Atlas (free M0)
- Backend: Render (Root dir `server`, build `npm install`, start `npm start`)
- Frontend: Vercel (Root dir `client`, framework Vite, env `VITE_API_URL`)
Set `CLIENT_URL` on Render to your Vercel URL.

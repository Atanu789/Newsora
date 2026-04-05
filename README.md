# AI Automated News Platform

Production-ready starter with a client-server architecture:

- Frontend: Next.js App Router + Tailwind
- Backend: Node.js + Express + PostgreSQL
- AI layer: OpenAI or Gemini JSON summarization/classification/tagging

## Project Structure

- backend
- frontend

## 1) Backend setup

1. Copy backend/.env.example to backend/.env and set values.
2. Install dependencies:
   - cd backend
   - npm install
3. Initialize DB schema:
   - npm run db:init
4. Run backend:
   - npm run dev

Backend default URL: http://localhost:5000

## 2) Frontend setup

1. Copy frontend/.env.local.example to frontend/.env.local
2. Install dependencies:
   - cd frontend
   - npm install
3. Run frontend:
   - npm run dev

Frontend default URL: http://localhost:3000

## Implemented APIs

- GET /api/news
- GET /api/news/:id
- GET /api/news?category=&page=
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user/profile
- POST /api/activity
- POST /api/submissions
- GET /api/submissions (admin)
- PATCH /api/submissions/:id/approve (admin)
- PATCH /api/submissions/:id/reject (admin)

## Notes

- Full copyrighted article text is not persisted. Storage focuses on summary + source URL.
- News ingestion runs every 15 minutes via cron.
- AI response format is strict JSON: summary, category, tags.

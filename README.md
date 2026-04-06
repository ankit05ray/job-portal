# Job Portal — Full Stack Application

A full-stack Job Portal / Resume Management System built with React, Node.js, Express, MongoDB and TypeScript.

## Features

- User authentication with JWT (register/login)
- Role-based access — Jobseeker and Recruiter
- Recruiters can post, edit, and delete jobs
- Jobseekers can browse jobs, upload resumes, and apply
- Skill-based match scoring (pure algorithmic, no AI)
- Application status tracking (applied → reviewing → accepted/rejected)
- Recruiter dashboard with applicant management
- Jobseeker dashboard with application history

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Axios
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcryptjs
- **File Upload:** Multer

## Project Structure
job-portal/
├── client/     # React frontend (Vite + TypeScript)
└── server/     # Express backend (Node.js + TypeScript)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:
VITE_API_URL=http://localhost:8000
```bash
npm run dev
```

### Access the app

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Health check: http://localhost:8000/api/health

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | — |
| POST | /api/auth/login | Login user | — |
| GET | /api/jobs | Get all jobs | — |
| POST | /api/jobs | Post a job | Recruiter |
| POST | /api/applications/:jobId | Apply to job | Jobseeker |
| GET | /api/applications/my | My applications | JWT |
| POST | /api/resumes/upload | Upload resume | JWT |
| PUT | /api/resumes/skills | Update skills | JWT |

## Deployment

- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)
- Database: [MongoDB Atlas](https://cloud.mongodb.com)

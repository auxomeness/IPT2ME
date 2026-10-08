# Simple Grade Management System

A prototype for students to sign in and view their subjects, grades, and average. Instructors and administrators can manage grades. The application has a React/Vite frontend, an Express API, and a shared SQLite database.

## Requirements and implemented behavior

- **Student accounts and authentication:** Login uses a username and password. Passwords are stored as bcrypt hashes. Successful login returns a one-hour bearer token. There is no public registration endpoint; trusted project staff provision accounts and assign roles.
- **Student listing:** `GET /api/students` requires a valid token and the `student` role.
- **Subjects:** Users can list subjects, search by name/instructor/section, and retrieve one subject by ID. Subject records require a name, instructor, and section.
- **Grades:** Instructor and admin roles can create and update grades. Authenticated students can view their own grades; instructors and admins can view any student's grades. Grade values must be finite numbers. The grading scale has not been defined.
- **Average:** The API calculates the arithmetic mean of a student's recorded grades, rounded to two decimal places. If there are no grades, it returns a null average and a count of zero.
- **API responses:** Responses use `{ "success": true|false, "message": "...", "data": ... }`. Errors have `data: null`.
- **Frontend:** The UI provides login, subject browsing/search, grades, and average views, connected to the backend API.

## System structure

```text
IPT2ME/
├── backend/
│   ├── src/
│   │   ├── controllers/       # HTTP request and response handling
│   │   ├── db/                # SQLite connection and initialization
│   │   ├── middleware/        # Authentication, authorization, errors
│   │   ├── models/            # Student, subject, grade persistence
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # Feature logic
│   │   ├── utils/             # Shared JSON response helpers
│   │   ├── validators/        # Request input validation
│   │   └── server.js          # Express app and API setup
│   ├── test/                  # Backend unit and API tests
│   ├── .env.example           # Backend environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/api.js    # Calls backend endpoints
│   │   ├── App.jsx            # Login/session and navigation
│   │   ├── LoginPage.jsx
│   │   ├── SubjectsPage.jsx
│   │   ├── GradesPage.jsx
│   │   ├── AveragePage.jsx
│   │   └── main.jsx           # React entry point
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json              # npm workspaces and shared commands
├── package-lock.json
├── eslint.config.js
└── README.md
```

### API routes

All routes are under `/api`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/login` | Public | Authenticate a student, instructor, or admin |
| `GET` | `/students` | Student role | List student IDs and usernames |
| `GET` | `/subjects` | Public | List subjects; optional `?q=search` |
| `GET` | `/subjects/:id` | Public | Look up one subject |
| `POST` | `/grades` | Instructor/admin | Create a grade |
| `PUT` | `/grades/:id` | Instructor/admin | Update a grade |
| `GET` | `/students/:studentId/grades` | Own student record, or instructor/admin | List grades for a student |
| `GET` | `/students/:studentId/average` | Own student record, or instructor/admin | Get grade average and count |

Protected endpoints expect `Authorization: Bearer <token>`.

## Run locally

### Prerequisites

- Node.js `20.19.0` or later (`.nvmrc` records the project baseline)
- npm `10` or later

Check versions:

```bash
node --version
npm --version
```

### Install and configure

From the repository root:

```bash
npm ci
cp backend/.env.example backend/.env
```

Edit `backend/.env` and replace `JWT_SECRET` with a private random value of at least 32 bytes. `PORT`, `FRONTEND_ORIGIN`, and `DATABASE_PATH` have usable local defaults. The SQLite database and its tables are created automatically at `backend/data/grades.db` when the backend starts.

The frontend defaults to `http://localhost:3000/api`. To change that URL, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

### Seed local demo data

There is no public registration endpoint. From the repository root, run:

```bash
npm run seed
```

This creates or refreshes three local mock accounts, one sample subject, and one grade in `backend/data/grades.db`. The command is safe to run again; it avoids duplicate sample subjects and grades.

Mock accounts for local use:

| Role | Username | Password |
| --- | --- | --- |
| Student | `demo.student` | `StudentDemo2026!` |
| Instructor | `demo.instructor` | `InstructorDemo2026!` |
| Admin | `demo.admin` | `AdminDemo2026!` |

Sign in at [http://localhost:5173](http://localhost:5173) with the student account. The seeder resets these reserved mock accounts to the credentials above. It is for local development only and must not be used with production data.

### Start the application

From the repository root:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The backend listens at [http://localhost:3000](http://localhost:3000). Stop both development servers with `Ctrl+C`.

To run one workspace by itself, use `npm run dev --workspace backend` or `npm run dev --workspace frontend` from the root.

## Project commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start backend and frontend together |
| `npm run seed` | Create or refresh local mock accounts and sample data |
| `npm run lint` | Lint the project |
| `npm test` | Run backend and frontend test commands |
| `npm run build` | Check backend syntax and create the frontend production build |

## Development notes

- Keep HTTP handling in controllers, business rules in services, persistence in models, and request checks in validators.
- Keep secrets in local `.env` files; do not commit those files or real credentials.

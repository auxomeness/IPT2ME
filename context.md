# Project Context: Simple Grade Management System

## Purpose

Build a simple system where students can log in, see their subjects and grades, and review their average. The frontend communicates with backend APIs. SQLite is the selected database.

## Team and ownership

The team has five developers: one frontend developer and four backend developers.

### Developer 1 — Frontend

- **GRADE-FE-01:** Create student login.
- **GRADE-FE-02:** Display the subject list.
- **GRADE-FE-03:** Display grades.
- **GRADE-FE-04:** Display the student's average.
- **GRADE-FE-05:** Connect the frontend to backend APIs.

### Developer 2 — Backend: Students

- **STU-BE-01:** Create the Student model.
- **STU-BE-02:** Implement login.
- **STU-BE-03:** Implement student listing.
- **STU-BE-04:** Hash passwords; never store or return plaintext passwords.
- **STU-BE-05:** Implement student authentication.

### Developer 3 — Backend: Subjects

- **SUB-BE-01:** Create the Subject model.
- **SUB-BE-02:** Implement the Get Subjects API.
- **SUB-BE-03:** Implement subject search.
- **SUB-BE-04:** Validate subject information.
- **SUB-BE-05:** Implement subject lookup.

### Developer 4 — Backend: Grades

- **GRD-BE-01:** Create the Grade model.
- **GRD-BE-02:** Implement the Create Grade API.
- **GRD-BE-03:** Implement the Get Student Grades API.
- **GRD-BE-04:** Implement the Update Grade API.
- **GRD-BE-05:** Calculate the student's average.

### Developer 5 — Backend: Security

- **SEC-BE-01:** Protect grade endpoints.
- **SEC-BE-02:** Validate grade values.
- **SEC-BE-03:** Prevent invalid grades.
- **SEC-BE-04:** Implement error handling.
- **SEC-BE-05:** Standardize API responses.

## Repository and technical direction

- **Backend:** Node.js with Express, written in JavaScript ES modules.
- **Frontend:** React with JavaScript and Vite.
- **Database:** SQLite, using the existing `better-sqlite3` connection helper for subject lookup.
- **Backend organization:** `backend/src/server.js` starts Express; `routes/` maps API paths; `validators/` checks request data; `controllers/` handles HTTP input/output; `services/` holds business logic; `models/` contains persistence models when needed.
- **Frontend entry:** `frontend/src/main.jsx` mounts the app and `frontend/src/App.jsx` is the root component.
- **Development workflow:** npm workspaces; use the root commands `npm run dev`, `npm run lint`, `npm test`, and `npm run build`.

The backend files currently contain minimal JavaScript scaffolding and TODOs. Add feature behavior in the appropriate layer. Keep the frontend and backend in their assigned ownership areas and coordinate API contracts between developers.

## Feature dependencies and coordination

- Frontend tasks depend on agreeing with backend developers on endpoint paths, request/response formats, login behavior, and how authentication is sent.
- Student login, password hashing, and authentication (Developer 2) must coordinate with grade endpoint protection (Developer 5).
- Grade creation, updates, value validation, and invalid-grade prevention (Developers 4 and 5) overlap and should share one agreed grading policy.
- Subject listing, lookup, and search (Developer 3) should agree on search parameters and response shape with the frontend developer.
- Backend JSON responses use `{ success, message, data }`; errors use `data: null`. Use the shared response helpers in `backend/src/utils/apiResponse.js`.

## Decisions still to make

Do not invent these details when implementing a task. Ask the team or use an explicitly approved project decision:

- Whether MongoDB will be used; if so, connection setup, schemas, identifiers, and seed data.
- Login request/response fields and authentication mechanism, token/session behavior, and token lifetime.
- API route paths and HTTP status codes.
- Student listing access rules and whether listing is required by the student-facing UI.
- Subject search fields, matching behavior, and pagination, if needed.
- Allowed grade scale, accepted value format, and rules for invalid or missing grades.
- Average calculation rules, including rounding and how missing grades are handled.
- Which authenticated users may create or update grades and what authorization checks apply.

## Subject lookup API (SUB-BE-05)

- `GET /api/subjects/:id` looks up one subject by its positive integer ID.
- A valid ID returns HTTP 200 with `{ "success": true, "message": "Subject retrieved successfully", "data": { ... } }`.
- Malformed IDs return HTTP 400; valid IDs with no matching subject return HTTP 404.

## Guidance for coding agents

1. Read this file and inspect the existing code before making changes.
2. Implement only the requested task IDs; preserve the assigned responsibility boundaries.
3. Keep HTTP handling in controllers, business rules in services, validation in validators, and persistence in models.
4. Keep secrets in environment variables. Hash passwords and never log credentials or authentication tokens.
5. Add focused tests for behavior being implemented. Run lint, tests, and builds before reporting completion.
6. Update this context or the README when the team makes a shared decision that affects future work.

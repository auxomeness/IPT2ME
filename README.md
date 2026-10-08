# IPT2ME

## Student model

Developer 2's first ticket (STU-BE-01) is in [`backend/`](./backend/). It adds a
SQLite `students` table and persistence model using `better-sqlite3`. Students
have an integer ID, a unique username, and a `password_hash` column. Password
hashing and authentication belong to later tickets; callers must pass a hash,
not a plaintext password, to the model.

From `backend/`, run `npm install` and `npm test` to exercise the model.

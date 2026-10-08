export function initializeDatabase(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'instructor', 'admin'))
    )
  `);

  const studentColumns = database.pragma("table_info(students)");
  if (!studentColumns.some((column) => column.name === "role")) {
    database.exec(`
      ALTER TABLE students
      ADD COLUMN role TEXT NOT NULL DEFAULT 'student'
      CHECK (role IN ('student', 'instructor', 'admin'))
    `);
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      instructor TEXT NOT NULL,
      section TEXT NOT NULL
    )
  `);
}

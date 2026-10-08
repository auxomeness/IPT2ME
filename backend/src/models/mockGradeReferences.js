function run(database, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, parameters, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

/**
 * Temporary ID-only reference tables let the Grade API run until the Student
 * and Subject persistence models are connected. Replace these adapters when
 * those models provide their approved schemas and lookup methods.
 */
export async function createMockGradeReferences(database) {
  await run(
    database,
    "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY)",
  );
  await run(
    database,
    "CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY)",
  );

  return Object.freeze({
    async ensureStudentExists(id) {
      await run(database, "INSERT OR IGNORE INTO students (id) VALUES (?)", [id]);
      return true;
    },
    async ensureSubjectExists(id) {
      await run(database, "INSERT OR IGNORE INTO subjects (id) VALUES (?)", [id]);
      return true;
    },
  });
}

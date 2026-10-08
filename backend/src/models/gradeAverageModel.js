function get(database, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    database.get(sql, parameters, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row ?? null);
    });
  });
}

export function createGradeAverageModel(database) {
  if (!database || typeof database.get !== "function") {
    throw new TypeError("A sqlite3 Database connection is required");
  }

  return Object.freeze({
    calculateByStudentId(studentId) {
      return get(
        database,
        `SELECT ROUND(AVG(grade), 2) AS average, COUNT(*) AS grade_count
         FROM grades
         WHERE student_id = ?`,
        [studentId],
      );
    },
  });
}

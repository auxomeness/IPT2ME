import { isValidGrade } from "../validators/gradeValidator.js";

function run(database, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    database.run(sql, parameters, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

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

function all(database, sql, parameters = []) {
  return new Promise((resolve, reject) => {
    database.all(sql, parameters, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

/**
 * Create a Grade model backed by an open sqlite3 Database connection.
 * The caller owns the connection lifecycle and should call initialize() before
 * using the model.
 */
export function createGradeModel(database) {
  if (
    !database ||
    typeof database.run !== "function" ||
    typeof database.get !== "function" ||
    typeof database.all !== "function"
  ) {
    throw new TypeError("A sqlite3 Database connection is required");
  }

  async function initialize() {
    await run(database, "PRAGMA foreign_keys = ON");
    await run(
      database,
      `CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY,
        student_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        grade REAL NOT NULL CHECK (
          typeof(grade) IN ('integer', 'real')
          AND grade >= 1
          AND grade <= 100
        ),
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      )`,
    );

    const invalidGrade = await get(
      database,
      "SELECT id FROM grades WHERE grade < 1 OR grade > 100 LIMIT 1",
    );
    if (invalidGrade) {
      throw new Error(
        `Existing grade ${invalidGrade.id} is outside the allowed 1–100 range and must be corrected before startup`,
      );
    }

    await run(
      database,
      `CREATE TRIGGER IF NOT EXISTS grades_grade_range_insert
       BEFORE INSERT ON grades
       WHEN NEW.grade < 1 OR NEW.grade > 100
       BEGIN
         SELECT RAISE(ABORT, 'Grade must be a number between 1 and 100');
       END`,
    );
    await run(
      database,
      `CREATE TRIGGER IF NOT EXISTS grades_grade_range_update
       BEFORE UPDATE OF grade ON grades
       WHEN NEW.grade < 1 OR NEW.grade > 100
       BEGIN
         SELECT RAISE(ABORT, 'Grade must be a number between 1 and 100');
       END`,
    );
  }

  async function create({ student_id, subject_id, grade }) {
    assertValidGrade(grade);

    const result = await run(
      database,
      `INSERT INTO grades (student_id, subject_id, grade)
       VALUES (?, ?, ?)`,
      [student_id, subject_id, grade],
    );

    return get(database, "SELECT * FROM grades WHERE id = ?", [result.lastID]);
  }

  function findById(id) {
    return get(database, "SELECT * FROM grades WHERE id = ?", [id]);
  }

  function findByStudentId(studentId) {
    return all(
      database,
      "SELECT * FROM grades WHERE student_id = ? ORDER BY id",
      [studentId],
    );
  }

  async function update(id, grade) {
    assertValidGrade(grade);

    const result = await run(
      database,
      "UPDATE grades SET grade = ? WHERE id = ?",
      [grade, id],
    );

    if (result.changes === 0) {
      return null;
    }

    return findById(id);
  }

  return Object.freeze({
    initialize,
    create,
    findById,
    findByStudentId,
    update,
  });
}

function assertValidGrade(grade) {
  if (!isValidGrade(grade)) {
    throw new TypeError("Grade must be a number between 1 and 100");
  }
}

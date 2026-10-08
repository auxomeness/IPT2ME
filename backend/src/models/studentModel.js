import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;
const STUDENT_ROLES = new Set(["student", "instructor", "admin"]);

export class StudentModel {
  constructor(database) {
    this.insertStatement = database.prepare(
      "INSERT INTO students (username, password_hash, role) VALUES (?, ?, ?)"
    );
    this.findByUsernameStatement = database.prepare(
      "SELECT id, username, password_hash, role FROM students WHERE username = ?"
    );
    this.findByIdStatement = database.prepare(
      "SELECT id, username, role FROM students WHERE id = ?"
    );
    this.listStatement = database.prepare(
      "SELECT id, username FROM students ORDER BY id"
    );
  }

  async create(username, password, role = "student") {
    if (!STUDENT_ROLES.has(role)) {
      throw new TypeError("Role must be student, instructor, or admin");
    }
    if (typeof password !== "string" || password.length === 0) {
      throw new TypeError("Password is required");
    }
    if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
      throw new RangeError("Password must not exceed 72 UTF-8 bytes");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const result = this.insertStatement.run(username, passwordHash, role);
    return { id: Number(result.lastInsertRowid), username, role };
  }

  findByUsername(username) {
    return this.findByUsernameStatement.get(username);
  }

  findById(id) {
    return this.findByIdStatement.get(id);
  }

  list() {
    return this.listStatement.all();
  }
}

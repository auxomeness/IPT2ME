export class StudentModel {
  constructor(database) {
    this.insertStatement = database.prepare(
      "INSERT INTO students (username, password_hash) VALUES (?, ?)"
    );
    this.findByUsernameStatement = database.prepare(
      "SELECT id, username, password_hash FROM students WHERE username = ?"
    );
    this.findByIdStatement = database.prepare(
      "SELECT id, username, password_hash FROM students WHERE id = ?"
    );
    this.listStatement = database.prepare(
      "SELECT id, username FROM students ORDER BY id"
    );
  }

  create(username, passwordHash) {
    const result = this.insertStatement.run(username, passwordHash);
    return { id: Number(result.lastInsertRowid), username };
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

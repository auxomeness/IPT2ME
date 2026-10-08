export class StudentModel {
  constructor(database) {
    this.insertStatement = database.prepare(
      "INSERT INTO students (username, password_hash) VALUES (?, ?)"
    );
    this.findByUsernameStatement = database.prepare(
      "SELECT id, username, password_hash FROM students WHERE username = ?"
    );
  }

  create(username, passwordHash) {
    const result = this.insertStatement.run(username, passwordHash);
    return { id: Number(result.lastInsertRowid), username };
  }

  findByUsername(username) {
    return this.findByUsernameStatement.get(username);
  }
}

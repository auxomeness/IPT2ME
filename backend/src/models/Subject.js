/** A subject record returned by the persistence model. */
export class Subject {
  constructor({ id, name, instructor, section }) {
    this.id = id;
    this.name = name;
    this.instructor = instructor;
    this.section = section;
  }
}

export class SubjectModel {
  constructor(database) {
    this.findByIdStatement = database.prepare(
      `SELECT id, name, instructor, section
       FROM subjects
       WHERE id = ?`,
    );
  }

  findById(id) {
    const row = this.findByIdStatement.get(id);
    return row ? new Subject(row) : null;
  }
}

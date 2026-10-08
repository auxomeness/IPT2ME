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
    this.listStatement = database.prepare(
      `SELECT id, name, instructor, section
       FROM subjects
       ORDER BY name COLLATE NOCASE, section COLLATE NOCASE, id`,
    );
    this.searchStatement = database.prepare(
      `SELECT id, name, instructor, section
       FROM subjects
       WHERE LOWER(name) LIKE LOWER(?) ESCAPE char(92)
          OR LOWER(instructor) LIKE LOWER(?) ESCAPE char(92)
          OR LOWER(section) LIKE LOWER(?) ESCAPE char(92)
       ORDER BY name COLLATE NOCASE, section COLLATE NOCASE, id`,
    );
  }

  findById(id) {
    const row = this.findByIdStatement.get(id);
    return row ? new Subject(row) : null;
  }

  list() {
    return this.listStatement.all().map((row) => new Subject(row));
  }

  search(searchTerm) {
    const escapedTerm = searchTerm.replace(/[\\%_]/g, "\\$&");
    const pattern = `%${escapedTerm}%`;
    return this.searchStatement
      .all(pattern, pattern, pattern)
      .map((row) => new Subject(row));
  }
}

import database from "../db/connection.js";

/** Subject record backed by the subjects table. */
export class Subject {
  constructor({ id, name, instructor, section }) {
    this.id = id;
    this.name = name;
    this.instructor = instructor;
    this.section = section;
  }

  static findAll() {
    const rows = database
      .prepare(
        `SELECT id, name, instructor, section
         FROM subjects
         ORDER BY name COLLATE NOCASE, section COLLATE NOCASE, id`,
      )
      .all();

    return rows.map((row) => new Subject(row));
  }
}

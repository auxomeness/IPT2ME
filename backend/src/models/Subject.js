/**
 * Database-independent representation of a subject.
 * Persistence can be added once the project selects a database.
 */
export class Subject {
  constructor({ name, instructor, section }) {
    this.name = name;
    this.instructor = instructor;
    this.section = section;
  }
}

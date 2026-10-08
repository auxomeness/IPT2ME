import { SubjectModel } from "../models/Subject.js";

export function createSubjectService(database) {
  const subjects = new SubjectModel(database);

  return {
    findById(id) {
      return subjects.findById(id);
    },

    list() {
      return subjects.list();
    },

    search(searchTerm) {
      return subjects.search(searchTerm);
    },
  };
}

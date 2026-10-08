export class GradeReferenceNotFoundError extends Error {
  constructor(reference) {
    super(`${reference} was not found`);
    this.name = "GradeReferenceNotFoundError";
  }
}

export function createGradeService({ gradeModel, gradeReferences }) {
  if (!gradeModel || !gradeReferences) {
    throw new TypeError("Grade model and reference models are required");
  }

  return Object.freeze({
    async createGrade({ student_id, subject_id, grade }) {
      if (!(await gradeReferences.ensureStudentExists(student_id))) {
        throw new GradeReferenceNotFoundError("Student");
      }
      if (!(await gradeReferences.ensureSubjectExists(subject_id))) {
        throw new GradeReferenceNotFoundError("Subject");
      }
      return gradeModel.create({ student_id, subject_id, grade });
    },

    getStudentGrades(studentId) {
      return gradeModel.findByStudentId(studentId);
    },

    async updateGrade(id, grade) {
      return gradeModel.update(id, grade);
    },
  });
}

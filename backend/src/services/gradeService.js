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
      const studentExists = await gradeReferences.ensureStudentExists(student_id);
      if (!studentExists) {
        throw new GradeReferenceNotFoundError("Student");
      }

      const subjectExists = await gradeReferences.ensureSubjectExists(subject_id);
      if (!subjectExists) {
        throw new GradeReferenceNotFoundError("Subject");
      }

      return gradeModel.create({ student_id, subject_id, grade });
    },

    async updateGrade(id, grade) {
      return gradeModel.update(id, grade);
    },
  });
}

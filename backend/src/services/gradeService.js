export function createGradeService(gradeModel) {
  if (!gradeModel || typeof gradeModel.findByStudentId !== "function") {
    throw new TypeError("A grade model with findByStudentId() is required");
  }

  return Object.freeze({
    getStudentGrades(studentId) {
      return gradeModel.findByStudentId(studentId);
    },
  });
}

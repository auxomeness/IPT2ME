export function createGradeAverageService(gradeAverageModel) {
  if (
    !gradeAverageModel ||
    typeof gradeAverageModel.calculateByStudentId !== "function"
  ) {
    throw new TypeError("A grade average model with calculateByStudentId() is required");
  }

  return Object.freeze({
    async getStudentAverage(studentId) {
      return gradeAverageModel.calculateByStudentId(studentId);
    },
  });
}

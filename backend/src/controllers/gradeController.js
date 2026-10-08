export function createGetStudentGradesController(gradeService) {
  return async function handleGetStudentGrades(request, response) {
    try {
      const grades = await gradeService.getStudentGrades(
        request.validatedStudentId,
      );

      return response.status(200).json({
        success: true,
        message: "Student grades retrieved",
        data: grades,
      });
    } catch {
      return response.status(500).json({
        success: false,
        message: "Unable to retrieve student grades",
        errors: [],
      });
    }
  };
}

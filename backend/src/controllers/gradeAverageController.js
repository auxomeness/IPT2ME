export function createGradeAverageController(gradeAverageService) {
  return async function handleGetStudentAverage(request, response) {
    try {
      const result = await gradeAverageService.getStudentAverage(
        request.validatedStudentId,
      );

      return response.status(200).json({
        success: true,
        message: "Student average retrieved",
        data: {
          student_id: request.validatedStudentId,
          average: result.average,
          grade_count: result.grade_count,
        },
      });
    } catch {
      return response.status(500).json({
        success: false,
        message: "Unable to retrieve student average",
        errors: [],
      });
    }
  };
}

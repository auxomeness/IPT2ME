import { sendSuccess } from "../utils/apiResponse.js";

export function createGradeAverageController(gradeAverageService) {
  return async function handleGetStudentAverage(request, response, next) {
    try {
      const result = await gradeAverageService.getStudentAverage(
        request.validatedStudentId,
      );

      return sendSuccess(
        response,
        {
          student_id: request.validatedStudentId,
          average: result.average,
          grade_count: result.grade_count,
        },
        { message: "Student average retrieved" },
      );
    } catch (error) {
      return next(error);
    }
  };
}

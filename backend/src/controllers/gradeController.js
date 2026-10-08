import { GradeReferenceNotFoundError } from "../services/gradeService.js";

export function createGradeController(gradeService) {
  return async function handleCreateGrade(request, response) {
    try {
      const grade = await gradeService.createGrade(request.body);

      return response.status(201).json({
        success: true,
        message: "Grade created",
        data: grade,
      });
    } catch (error) {
      if (error instanceof GradeReferenceNotFoundError) {
        return response.status(404).json({
          success: false,
          message: error.message,
          errors: [],
        });
      }

      return response.status(500).json({
        success: false,
        message: "Unable to create grade",
        errors: [],
      });
    }
  };
}

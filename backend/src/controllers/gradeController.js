import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { GradeReferenceNotFoundError } from "../services/gradeService.js";

export function createGradeController(gradeService) {
  return {
    async create(request, response, next) {
      try {
        const grade = await gradeService.createGrade(request.body);
        return sendSuccess(response, grade, {
          status: 201,
          message: "Grade created",
        });
      } catch (error) {
        if (error instanceof GradeReferenceNotFoundError) {
          return sendError(response, 404, error.message);
        }
        return next(error);
      }
    },

    async list(request, response, next) {
      try {
        const grades = await gradeService.getStudentGrades(
          request.validatedStudentId,
        );
        return sendSuccess(response, grades, {
          message: "Student grades retrieved",
        });
      } catch (error) {
        return next(error);
      }
    },

    async update(request, response, next) {
      try {
        const grade = await gradeService.updateGrade(
          request.validatedGradeId,
          request.body.grade,
        );
        if (!grade) {
          return sendError(response, 404, "Grade not found");
        }
        return sendSuccess(response, grade, { message: "Grade updated" });
      } catch (error) {
        return next(error);
      }
    },
  };
}

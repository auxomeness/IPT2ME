import { Router } from "express";
import { createGetStudentGradesController } from "../controllers/gradeController.js";
import { requireAuthenticatedUser } from "../middleware/authMiddleware.js";
import { validateStudentIdParam } from "../validators/gradeValidator.js";

function requireOwnStudentGrades(request, response, next) {
  const requesterStudentId =
    request.user.studentId ?? request.user.student_id ?? request.user.id;

  if (Number(requesterStudentId) !== request.validatedStudentId) {
    return response.status(403).json({
      success: false,
      message: "You may only view your own grades",
      errors: [],
    });
  }

  return next();
}

export function createGradeRouter(gradeService) {
  if (!gradeService || typeof gradeService.getStudentGrades !== "function") {
    throw new TypeError("A grade service with getStudentGrades() is required");
  }

  const router = Router();

  router.get(
    "/students/:studentId/grades",
    requireAuthenticatedUser,
    validateStudentIdParam,
    requireOwnStudentGrades,
    createGetStudentGradesController(gradeService),
  );

  return router;
}

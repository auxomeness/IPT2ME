import { Router } from "express";
import { createGradeAverageController } from "../controllers/gradeAverageController.js";
import { requireAuthenticatedUser } from "../middleware/authMiddleware.js";
import { requireOwnStudentAverage } from "../middleware/gradeAverageAccessMiddleware.js";
import { validateStudentIdParam } from "../validators/gradeAverageValidator.js";

export function createGradeAverageRouter(gradeAverageService, authenticateStudent) {
  if (
    !gradeAverageService ||
    typeof gradeAverageService.getStudentAverage !== "function"
  ) {
    throw new TypeError("A grade average service with getStudentAverage() is required");
  }
  if (typeof authenticateStudent !== "function") {
    throw new TypeError("A student authentication middleware is required");
  }

  const router = Router();

  router.get(
    "/students/:studentId/average",
    authenticateStudent,
    requireAuthenticatedUser,
    validateStudentIdParam,
    requireOwnStudentAverage,
    createGradeAverageController(gradeAverageService),
  );

  return router;
}

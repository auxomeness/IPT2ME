import { Router } from "express";
import {
  createGradeController,
  createUpdateGradeController,
} from "../controllers/gradeController.js";
import { requireAuthenticatedUser } from "../middleware/authMiddleware.js";
import {
  validateCreateGradeInput,
  validateGradeIdParam,
  validateGradeInput,
} from "../validators/gradeValidator.js";

const GRADE_WRITER_ROLES = new Set(["instructor", "admin"]);

function requireGradeWriter(request, response, next) {
  if (!GRADE_WRITER_ROLES.has(request.user.role)) {
    return response.status(403).json({
      success: false,
      message: "Instructor or admin access required",
      errors: [],
    });
  }

  return next();
}

export function createGradeRouter(gradeService) {
  if (
    !gradeService ||
    typeof gradeService.createGrade !== "function" ||
    typeof gradeService.updateGrade !== "function"
  ) {
    throw new TypeError("A grade service with createGrade() and updateGrade() is required");
  }

  const router = Router();

  router.post(
    "/grades",
    requireAuthenticatedUser,
    requireGradeWriter,
    validateCreateGradeInput,
    createGradeController(gradeService),
  );

  router.put(
    "/grades/:id",
    requireAuthenticatedUser,
    requireGradeWriter,
    validateGradeIdParam,
    validateGradeInput,
    createUpdateGradeController(gradeService),
  );

  return router;
}

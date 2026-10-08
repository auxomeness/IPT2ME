import { Router } from "express";
import { createGradeController } from "../controllers/gradeController.js";
import { sendError } from "../utils/apiResponse.js";
import {
  validateCreateGradeInput,
  validateGradeIdParam,
  validateGradeInput,
} from "../validators/gradeValidator.js";
import { validateStudentIdParam } from "../validators/gradeAverageValidator.js";

export function requireGradeWriter(request, response, next) {
  if (!["instructor", "admin"].includes(request.user.role)) {
    return sendError(response, 403, "Instructor or admin access required");
  }
  return next();
}

export function requireOwnStudentGrades(request, response, next) {
  if (
    request.user.role === "student" &&
    request.user.id !== request.validatedStudentId
  ) {
    return sendError(response, 403, "You may only view your own grades");
  }
  return next();
}

export function createGradeRouter(gradeService, authenticateStudent) {
  if (
    !gradeService ||
    typeof gradeService.createGrade !== "function" ||
    typeof gradeService.getStudentGrades !== "function" ||
    typeof gradeService.updateGrade !== "function"
  ) {
    throw new TypeError("Grade service must support create, list, and update");
  }
  if (typeof authenticateStudent !== "function") {
    throw new TypeError("A student authentication middleware is required");
  }

  const router = Router();
  const controller = createGradeController(gradeService);

  router.post(
    "/grades",
    authenticateStudent,
    requireGradeWriter,
    validateCreateGradeInput,
    controller.create,
  );
  router.get(
    "/students/:studentId/grades",
    authenticateStudent,
    validateStudentIdParam,
    requireOwnStudentGrades,
    controller.list,
  );
  router.put(
    "/grades/:id",
    authenticateStudent,
    requireGradeWriter,
    validateGradeIdParam,
    validateGradeInput,
    controller.update,
  );

  return router;
}

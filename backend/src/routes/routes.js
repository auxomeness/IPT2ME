import { Router } from "express";
import {
  createGetSubjectController,
  createListSubjectsController,
} from "../controllers/subjectController.js";
import { createSubjectService } from "../services/subjectService.js";
import { validateSubjectSearch } from "../validators/subjectValidator.js";
import { validateSubjectId } from "../validators/subjectLookupValidator.js";
import { createStudentController } from "../controllers/studentController.js";
import { validateLogin } from "../validators/loginValidator.js";
import { sendError } from "../utils/apiResponse.js";

export function createRoutes(database, { studentService, authenticateStudent }) {
  if (!studentService || typeof authenticateStudent !== "function") {
    throw new TypeError("Student service and authentication middleware are required");
  }

  const router = Router();
  const subjectService = createSubjectService(database);
  const studentController = createStudentController(studentService);

  router.post("/login", validateLogin, studentController.login);
  router.get("/students", authenticateStudent, requireStudentRole, studentController.list);

  router.get("/subjects", validateSubjectSearch, createListSubjectsController(subjectService));
  router.get(
    "/subjects/:id",
    validateSubjectId,
    createGetSubjectController(subjectService),
  );

  return router;
}

export function requireStudentRole(request, response, next) {
  if (request.user.role !== "student") {
    return sendError(response, 403, "Student access required");
  }
  return next();
}

export default createRoutes;

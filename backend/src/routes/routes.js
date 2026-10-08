import { Router } from "express";
import { createStudentController } from "../controllers/studentController.js";
import { validateLogin } from "../validators/loginValidator.js";

export default function createRoutes({ studentService }) {
  const router = Router();
  const studentController = createStudentController(studentService);

  router.post("/students/login", validateLogin, studentController.login);

  return router;
}

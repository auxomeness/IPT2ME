import { Router } from "express";
import { createStudentController } from "../controllers/studentController.js";
import { createAuthenticateToken } from "../middleware/authMiddleware.js";

export default function createRoutes({ studentService, jwtSecret }) {
  const router = Router();
  const authenticateToken = createAuthenticateToken(jwtSecret);
  const studentController = createStudentController(studentService);

  router.get("/students", authenticateToken, studentController.list);

  return router;
}

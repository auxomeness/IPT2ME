import { Router } from "express";
import { createGetSubjectsController } from "../controllers/subjectController.js";
import { SubjectModel } from "../models/Subject.js";

export function createRoutes(database) {
  const router = Router();
  const subjects = new SubjectModel(database);

  router.get("/subjects", createGetSubjectsController(subjects));

  return router;
}

export default createRoutes;

import { Router } from "express";
import { createGetSubjectController } from "../controllers/subjectController.js";
import { createSubjectService } from "../services/subjectService.js";
import { validateSubjectId } from "../validators/subjectLookupValidator.js";

export function createRoutes(database) {
  const router = Router();
  const subjectService = createSubjectService(database);

  router.get(
    "/subjects/:id",
    validateSubjectId,
    createGetSubjectController(subjectService),
  );

  return router;
}

export default createRoutes;

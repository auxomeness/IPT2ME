import { sendError, sendSuccess } from "../utils/apiResponse.js";

export function createGetSubjectController(subjectService) {
  return function getSubject(request, response, next) {
    try {
      const subject = subjectService.findById(request.subjectId);

      if (!subject) {
        return sendError(response, 404, "Subject not found");
      }

      return sendSuccess(response, subject, {
        message: "Subject retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

export function createListSubjectsController(subjectService) {
  return function listSubjects(request, response, next) {
    try {
      const subjects = request.query.q
        ? subjectService.search(request.query.q.trim())
        : subjectService.list();
      return sendSuccess(response, subjects, {
        message: "Subjects retrieved successfully",
      });
    } catch (error) {
      return next(error);
    }
  };
}

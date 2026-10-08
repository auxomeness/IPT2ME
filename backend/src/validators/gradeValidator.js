import { sendError } from "../utils/apiResponse.js";

export function isValidGrade(grade) {
  return typeof grade === "number" && Number.isFinite(grade);
}

export function validateGradeInput(request, response, next) {
  const grade = request.body?.grade;

  if (grade === undefined || grade === null || grade === "") {
    return sendError(response, 400, "Grade is required");
  }

  if (!isValidGrade(grade)) {
    return sendError(response, 400, "Grade must be a finite number");
  }

  return next();
}

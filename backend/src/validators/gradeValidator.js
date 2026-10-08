import { sendError } from "../utils/apiResponse.js";

export function isValidGrade(grade) {
  return (
    typeof grade === "number" &&
    Number.isFinite(grade) &&
    grade >= 1 &&
    grade <= 100
  );
}

export function validateGradeInput(request, response, next) {
  const grade = request.body?.grade;
  if (grade === undefined || grade === null || grade === "") {
    return sendError(response, 400, "Grade is required");
  }
  if (!isValidGrade(grade)) {
    return sendError(response, 400, "Grade must be a number between 1 and 100");
  }
  return next();
}

export function validateCreateGradeInput(request, response, next) {
  for (const field of ["student_id", "subject_id"]) {
    const value = request.body?.[field];
    if (!Number.isSafeInteger(value) || value <= 0) {
      return sendError(response, 400, `${field} must be a positive integer`);
    }
  }
  return validateGradeInput(request, response, next);
}

export function validateGradeIdParam(request, response, next) {
  const id = Number(request.params.id);
  if (!/^\d+$/.test(request.params.id) || !Number.isSafeInteger(id) || id <= 0) {
    return sendError(response, 400, "Grade ID must be a positive integer");
  }
  request.validatedGradeId = id;
  return next();
}

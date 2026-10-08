import { sendError } from "../utils/apiResponse.js";

export function validateStudentIdParam(request, response, next) {
  const studentId = Number(request.params.studentId);

  if (
    !/^\d+$/.test(request.params.studentId) ||
    !Number.isSafeInteger(studentId) ||
    studentId <= 0
  ) {
    return sendError(response, 400, "Student ID must be a positive integer");
  }

  request.validatedStudentId = studentId;
  return next();
}

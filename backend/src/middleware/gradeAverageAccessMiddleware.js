import { sendError } from "../utils/apiResponse.js";

export function requireOwnStudentAverage(request, response, next) {
  const principalStudentId = Number(
    request.user.student_id ?? request.user.id,
  );

  if (
    !Number.isSafeInteger(principalStudentId) ||
    principalStudentId !== request.validatedStudentId
  ) {
    return sendError(response, 403, "You may only view your own average");
  }

  return next();
}

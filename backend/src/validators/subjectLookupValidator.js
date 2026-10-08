import { sendError } from "../utils/apiResponse.js";

export function validateSubjectId(request, response, next) {
  const { id } = request.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return sendError(response, 400, "Subject ID must be a positive integer");
  }

  const subjectId = Number(id);

  if (!Number.isSafeInteger(subjectId)) {
    return sendError(response, 400, "Subject ID must be a positive integer");
  }

  request.subjectId = subjectId;
  return next();
}

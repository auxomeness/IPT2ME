import { sendError } from "../utils/apiResponse.js";

const SUBJECT_FIELDS = ["name", "instructor", "section"];

export function validateSubjectInput(request, response, next) {
  const subject = request.body;

  if (subject === null || typeof subject !== "object" || Array.isArray(subject)) {
    return sendError(response, 400, "Subject information must be an object");
  }

  for (const field of SUBJECT_FIELDS) {
    if (typeof subject[field] !== "string" || subject[field].trim() === "") {
      return sendError(response, 400, `${field} must be a non-empty string`);
    }
  }

  request.body = Object.fromEntries(
    SUBJECT_FIELDS.map((field) => [field, subject[field].trim()]),
  );
  return next();
}

export function validateSubjectSearch(request, response, next) {
  const query = request.query.q;

  if (query !== undefined && (typeof query !== "string" || query.trim() === "")) {
    return sendError(response, 400, "Search query must be a non-empty string");
  }

  return next();
}

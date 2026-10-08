const SUBJECT_FIELDS = ["name", "instructor", "section"];

export function validateSubjectInput(request, response, next) {
  const subject = request.body;

  if (
    subject === null ||
    typeof subject !== "object" ||
    Array.isArray(subject)
  ) {
    return response.status(400).json({
      success: false,
      message: "Subject information must be an object",
      errors: [],
    });
  }

  const errors = [];

  for (const field of SUBJECT_FIELDS) {
    if (typeof subject[field] !== "string" || subject[field].trim() === "") {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (errors.length > 0) {
    return response.status(400).json({
      success: false,
      message: "Subject information is invalid",
      errors,
    });
  }

  request.body = Object.fromEntries(
    SUBJECT_FIELDS.map((field) => [field, subject[field].trim()]),
  );

  return next();
}

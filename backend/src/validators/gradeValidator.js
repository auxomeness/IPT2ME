export function validateGradeInput(request, response, next) {
  const grade = request.body?.grade;

  if (grade === undefined || grade === null || grade === "") {
    return response.status(400).json({
      success: false,
      message: "Grade is required",
    });
  }

  if (typeof grade !== "number" || !Number.isFinite(grade)) {
    return response.status(400).json({
      success: false,
      message: "Grade must be a finite number",
    });
  }

  return next();
}

export function validateCreateGradeInput(request, response, next) {
  for (const field of ["student_id", "subject_id"]) {
    const value = request.body?.[field];

    if (!Number.isInteger(value) || value <= 0) {
      return response.status(400).json({
        success: false,
        message: `${field} must be a positive integer`,
        errors: [],
      });
    }
  }

  return validateGradeInput(request, response, next);
}

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

export function validateStudentIdParam(request, response, next) {
  const studentId = request.params.studentId;
  const parsedStudentId = Number(studentId);

  if (
    !/^\d+$/.test(studentId) ||
    !Number.isSafeInteger(parsedStudentId) ||
    parsedStudentId <= 0
  ) {
    return response.status(400).json({
      success: false,
      message: "studentId must be a positive integer",
      errors: [],
    });
  }

  request.validatedStudentId = parsedStudentId;
  return next();
}

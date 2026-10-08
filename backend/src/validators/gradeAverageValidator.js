export function validateStudentIdParam(request, response, next) {
  const studentId = Number(request.params.studentId);

  if (
    !/^\d+$/.test(request.params.studentId) ||
    !Number.isSafeInteger(studentId) ||
    studentId <= 0
  ) {
    return response.status(400).json({
      success: false,
      message: "Student ID must be a positive integer",
      errors: [],
    });
  }

  request.validatedStudentId = studentId;
  return next();
}

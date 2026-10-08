export function requireOwnStudentAverage(request, response, next) {
  const principalStudentId = Number(
    request.user.student_id ?? request.user.id,
  );

  if (
    !Number.isSafeInteger(principalStudentId) ||
    principalStudentId !== request.validatedStudentId
  ) {
    return response.status(403).json({
      success: false,
      message: "You may only view your own average",
      errors: [],
    });
  }

  return next();
}

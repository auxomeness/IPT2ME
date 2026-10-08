export function validateSubjectId(request, response, next) {
  const { id } = request.params;

  if (!/^[1-9]\d*$/.test(id)) {
    return response.status(400).json({
      success: false,
      message: "Subject ID must be a positive integer",
    });
  }

  const subjectId = Number(id);

  if (!Number.isSafeInteger(subjectId)) {
    return response.status(400).json({
      success: false,
      message: "Subject ID must be a positive integer",
    });
  }

  request.subjectId = subjectId;
  return next();
}

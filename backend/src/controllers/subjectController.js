export function createGetSubjectController(subjectService) {
  return function getSubject(request, response, next) {
    try {
      const subject = subjectService.findById(request.subjectId);

      if (!subject) {
        return response.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      return response.status(200).json({
        success: true,
        message: "Subject retrieved successfully",
        data: subject,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export function createStudentController(studentService) {
  return {
    async list(_request, response, next) {
      try {
        const students = await studentService.listStudents();
        return response.json({
          success: true,
          message: "Request successful",
          data: students
        });
      } catch (error) {
        return next(error);
      }
    }
  };
}

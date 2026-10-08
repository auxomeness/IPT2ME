export function createStudentController(studentService) {
  return {
    async login(request, response, next) {
      try {
        const result = await studentService.login(
          request.body.username,
          request.body.password
        );

        if (!result) {
          return response.status(401).json({
            success: false,
            message: "Invalid username or password",
            errors: []
          });
        }

        return response.json({
          success: true,
          message: "Login successful",
          data: result
        });
      } catch (error) {
        return next(error);
      }
    }
  };
}

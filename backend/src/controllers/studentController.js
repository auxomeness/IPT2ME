import { sendError, sendSuccess } from "../utils/apiResponse.js";

export function createStudentController(studentService) {
  return {
    async login(request, response, next) {
      try {
        const result = await studentService.login(
          request.body.username,
          request.body.password,
        );

        if (!result) {
          return sendError(response, 401, "Invalid username or password");
        }

        return sendSuccess(response, result, { message: "Login successful" });
      } catch (error) {
        return next(error);
      }
    },

    async list(_request, response, next) {
      try {
        return sendSuccess(response, studentService.listStudents());
      } catch (error) {
        return next(error);
      }
    },
  };
}

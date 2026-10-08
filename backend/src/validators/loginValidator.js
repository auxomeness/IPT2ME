import { sendError } from "../utils/apiResponse.js";

const MAX_PASSWORD_BYTES = 72;

export function validateLogin(request, response, next) {
  const { username, password } = request.body ?? {};

  if (typeof username !== "string" || username.trim() === "") {
    return sendError(response, 400, "Username is required");
  }
  if (typeof password !== "string" || password.length === 0) {
    return sendError(response, 400, "Password is required");
  }
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    return sendError(response, 400, "Password must not exceed 72 UTF-8 bytes");
  }

  request.body.username = username.trim();
  return next();
}

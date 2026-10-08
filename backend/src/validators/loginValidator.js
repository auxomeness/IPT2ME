export function validateLogin(request, response, next) {
  const { username, password } = request.body ?? {};
  const errors = [];

  if (typeof username !== "string" || username.trim().length === 0) {
    errors.push("Username is required");
  }

  if (typeof password !== "string" || password.length === 0) {
    errors.push("Password is required");
  } else if (Buffer.byteLength(password, "utf8") > 72) {
    errors.push("Password must not exceed 72 UTF-8 bytes");
  }

  if (errors.length > 0) {
    return response.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  request.body.username = username.trim();
  return next();
}

/**
 * Require a principal attached by the authentication middleware that verifies
 * the application's configured session or token.
 */
export function requireAuthenticatedUser(request, response, next) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return next();
}

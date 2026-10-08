import { sendError } from "../utils/apiResponse.js";

/**
 * Require a principal attached by the authentication middleware that verifies
 * the application's configured session or token.
 */
export function requireAuthenticatedUser(request, response, next) {
  if (!request.user) {
    return sendError(response, 401, "Authentication required");
  }

  return next();
}

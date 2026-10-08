import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse.js";

export function createStudentAuthenticator(jwtSecret) {
  if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes");
  }

  return function authenticateStudent(request, response, next) {
    const authorization = request.get("authorization");
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return sendError(response, 401, "Authentication required");
    }

    let payload;
    try {
      payload = jwt.verify(match[1], jwtSecret, { algorithms: ["HS256"] });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return sendError(response, 401, "Invalid or expired token");
      }
      return next(error);
    }

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      !Number.isSafeInteger(Number(payload.sub)) ||
      typeof payload.exp !== "number" ||
      !["student", "instructor", "admin"].includes(payload.role)
    ) {
      return sendError(response, 401, "Invalid or expired token");
    }

    request.user = { id: Number(payload.sub), role: payload.role };
    return next();
  };
}

export function requireAuthenticatedUser(request, response, next) {
  if (!request.user) {
    return sendError(response, 401, "Authentication required");
  }

  return next();
}

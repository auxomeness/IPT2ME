import jwt from "jsonwebtoken";

export function createAuthenticateToken(jwtSecret) {
  return function authenticateToken(request, response, next) {
    const authorization = request.get("authorization");
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return response.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    try {
      const payload = jwt.verify(match[1], jwtSecret, {
        algorithms: ["HS256"]
      });
      if (
        typeof payload === "string" ||
        typeof payload.sub !== "string" ||
        !/^[1-9]\d*$/.test(payload.sub) ||
        typeof payload.exp !== "number" ||
        payload.exp <= Math.floor(Date.now() / 1000)
      ) {
        throw new Error("Invalid token subject");
      }

      request.user = { id: payload.sub };
      return next();
    } catch {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  };
}

export function requireAuthenticatedUser(request, response, next) {
  if (!request.user) {
    return response.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  return next();
}

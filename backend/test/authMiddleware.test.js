import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";
import {
  createStudentAuthenticator,
  requireAuthenticatedUser
} from "../src/middleware/authMiddleware.js";

const jwtSecret = "test-secret-with-at-least-thirty-two-bytes";

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
}

function createRequest(token) {
  return {
    get: vi.fn().mockReturnValue(token ? `Bearer ${token}` : undefined)
  };
}

describe("student authentication middleware", () => {
  it("attaches the student ID from a valid bearer token", () => {
    const token = jwt.sign({ sub: "17" }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "1h"
    });
    const request = createRequest(token);
    const response = createResponse();
    const next = vi.fn();

    createStudentAuthenticator(jwtSecret)(request, response, next);

    expect(request.user).toEqual({ id: 17 });
    expect(next).toHaveBeenCalledOnce();
    expect(response.status).not.toHaveBeenCalled();
  });

  it.each([
    ["missing token", undefined],
    ["malformed token", "not-a-jwt"],
    ["expired token", jwt.sign({ sub: "17" }, jwtSecret, { expiresIn: -1 })],
    [
      "token signed with another secret",
      jwt.sign({ sub: "17" }, "different-secret-with-at-least-32-bytes")
    ],
    ["token without a student ID", jwt.sign({ role: "student" }, jwtSecret)]
  ])("rejects a %s", (_description, token) => {
    const request = createRequest(token);
    const response = createResponse();
    const next = vi.fn();

    createStudentAuthenticator(jwtSecret)(request, response, next);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: token ? "Invalid or expired token" : "Authentication required",
      data: null
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an insecurely short signing secret at setup", () => {
    expect(() => createStudentAuthenticator("too-short")).toThrow(
      "JWT_SECRET must contain at least 32 bytes"
    );
  });

  it("allows access only when an authenticated user is attached", () => {
    const response = createResponse();
    const next = vi.fn();

    requireAuthenticatedUser({ user: { id: 17 } }, response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.status).not.toHaveBeenCalled();
  });
});

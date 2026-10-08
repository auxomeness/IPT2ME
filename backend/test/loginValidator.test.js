import { describe, expect, it, vi } from "vitest";
import { validateLogin } from "../src/validators/loginValidator.js";

describe("login input validation", () => {
  it("requires a username and password", () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    validateLogin({ body: { username: "  ", password: "" } }, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Username is required",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("normalizes usernames and rejects bcrypt-incompatible password lengths", () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();
    const request = { body: { username: " student ", password: "valid" } };

    validateLogin(request, response, next);
    expect(request.body.username).toBe("student");
    expect(next).toHaveBeenCalledOnce();

    validateLogin(
      { body: { username: "student", password: "x".repeat(73) } },
      response,
      next,
    );
    expect(response.status).toHaveBeenCalledWith(400);
  });
});

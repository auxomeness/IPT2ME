import { describe, expect, it, vi } from "vitest";
import {
  requireGradeWriter,
  requireOwnStudentGrades,
} from "../src/routes/gradeRoutes.js";
import { requireStudentRole } from "../src/routes/routes.js";

function createResponse() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn() };
}

describe("grade access rules", () => {
  it.each(["instructor", "admin"])("allows %s to write grades", (role) => {
    const response = createResponse();
    const next = vi.fn();

    requireGradeWriter({ user: { role } }, response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(response.status).not.toHaveBeenCalled();
  });

  it("blocks a student from writing grades", () => {
    const response = createResponse();
    const next = vi.fn();

    requireGradeWriter({ user: { role: "student" } }, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Instructor or admin access required",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("allows a student to read only their own grades", () => {
    const response = createResponse();
    const next = vi.fn();

    requireOwnStudentGrades(
      { user: { id: 12, role: "student" }, validatedStudentId: 12 },
      response,
      next,
    );
    expect(next).toHaveBeenCalledOnce();

    requireOwnStudentGrades(
      { user: { id: 12, role: "student" }, validatedStudentId: 13 },
      response,
      next,
    );
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("allows student-authenticated users to list students, but not staff", () => {
    const response = createResponse();
    const next = vi.fn();

    requireStudentRole({ user: { id: 1, role: "student" } }, response, next);
    expect(next).toHaveBeenCalledOnce();

    requireStudentRole({ user: { id: 2, role: "instructor" } }, response, next);
    expect(response.status).toHaveBeenCalledWith(403);
  });
});

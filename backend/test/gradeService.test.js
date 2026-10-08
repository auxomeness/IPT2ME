import { describe, expect, it, vi } from "vitest";
import {
  createGradeService,
  GradeReferenceNotFoundError,
} from "../src/services/gradeService.js";
import {
  validateCreateGradeInput,
  validateGradeIdParam,
} from "../src/validators/gradeValidator.js";

describe("grade service", () => {
  it("checks references before creating a grade", async () => {
    const grade = { id: 1, student_id: 2, subject_id: 3, grade: 88 };
    const gradeModel = { create: vi.fn().mockResolvedValue(grade) };
    const gradeReferences = {
      ensureStudentExists: vi.fn().mockResolvedValue(true),
      ensureSubjectExists: vi.fn().mockResolvedValue(true),
    };
    const service = createGradeService({ gradeModel, gradeReferences });

    await expect(
      service.createGrade({ student_id: 2, subject_id: 3, grade: 88 }),
    ).resolves.toEqual(grade);
    expect(gradeModel.create).toHaveBeenCalledWith({
      student_id: 2,
      subject_id: 3,
      grade: 88,
    });
  });

  it("rejects missing student or subject references", async () => {
    const gradeModel = { create: vi.fn() };
    const service = createGradeService({
      gradeModel,
      gradeReferences: {
        ensureStudentExists: vi.fn().mockResolvedValue(false),
        ensureSubjectExists: vi.fn().mockResolvedValue(true),
      },
    });

    await expect(
      service.createGrade({ student_id: 404, subject_id: 3, grade: 88 }),
    ).rejects.toBeInstanceOf(GradeReferenceNotFoundError);
    expect(gradeModel.create).not.toHaveBeenCalled();
  });

  it("validates create grade references and update IDs", () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();
    validateCreateGradeInput(
      { body: { student_id: 1, subject_id: 2, grade: 90 } },
      response,
      next,
    );
    expect(next).toHaveBeenCalledOnce();

    validateCreateGradeInput(
      { body: { student_id: "1", subject_id: 2, grade: 90 } },
      response,
      next,
    );
    expect(response.status).toHaveBeenCalledWith(400);

    const request = { params: { id: "3" } };
    validateGradeIdParam(request, response, next);
    expect(request.validatedGradeId).toBe(3);
  });
});

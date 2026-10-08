import { describe, expect, it, vi } from "vitest";
import { createGradeModel } from "../src/models/gradeModel.js";
import {
  isValidGrade,
  validateGradeInput,
} from "../src/validators/gradeValidator.js";

describe("grade validation", () => {
  it.each([0, -1.5, 1000])("accepts finite numeric grades: %s", (grade) => {
    expect(isValidGrade(grade)).toBe(true);
  });

  it.each([undefined, null, "", "90", NaN, Infinity, -Infinity])(
    "rejects invalid grade values: %s",
    (grade) => {
      expect(isValidGrade(grade)).toBe(false);
    },
  );

  it("returns a client error for a non-finite grade", () => {
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateGradeInput({ body: { grade: Infinity } }, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Grade must be a finite number",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("blocks invalid values at the model write boundary", async () => {
    const database = {
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
    };
    const model = createGradeModel(database);

    await expect(
      model.create({ student_id: 1, subject_id: 1, grade: NaN }),
    ).rejects.toThrow("Grade must be a finite number");
    await expect(model.update(1, Infinity)).rejects.toThrow(
      "Grade must be a finite number",
    );
    expect(database.run).not.toHaveBeenCalled();
  });
});

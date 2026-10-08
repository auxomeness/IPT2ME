import { describe, expect, it, vi } from "vitest";
import { createGradeModel } from "../src/models/gradeModel.js";
import {
  isValidGrade,
  validateGradeInput,
} from "../src/validators/gradeValidator.js";

describe("grade validation", () => {
  it.each([1, 1.5, 100])("accepts grades from 1 through 100: %s", (grade) => {
    expect(isValidGrade(grade)).toBe(true);
  });

  it.each([undefined, null, "", "90", NaN, Infinity, -Infinity, 0, -1, 100.01, 101])(
    "rejects invalid grade values: %s",
    (grade) => {
      expect(isValidGrade(grade)).toBe(false);
    },
  );

  it("returns a client error for a grade outside the accepted range", () => {
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateGradeInput({ body: { grade: Infinity } }, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Grade must be a number between 1 and 100",
      data: null,
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
    ).rejects.toThrow("Grade must be a number between 1 and 100");
    await expect(model.update(1, Infinity)).rejects.toThrow(
      "Grade must be a number between 1 and 100",
    );
    expect(database.run).not.toHaveBeenCalled();
  });
});

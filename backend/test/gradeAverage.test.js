import { describe, expect, it, vi } from "vitest";
import { createGradeAverageController } from "../src/controllers/gradeAverageController.js";
import { requireOwnStudentAverage } from "../src/middleware/gradeAverageAccessMiddleware.js";
import { createGradeAverageModel } from "../src/models/gradeAverageModel.js";
import { createGradeAverageService } from "../src/services/gradeAverageService.js";
import { validateStudentIdParam } from "../src/validators/gradeAverageValidator.js";

describe("student grade average", () => {
  it("calculates an average and grade count for one student", async () => {
    const database = {
      get: vi.fn((_sql, parameters, callback) => {
        expect(parameters).toEqual([7]);
        callback(null, { average: 89.25, grade_count: 4 });
      }),
    };
    const model = createGradeAverageModel(database);

    await expect(model.calculateByStudentId(7)).resolves.toEqual({
      average: 89.25,
      grade_count: 4,
    });
    expect(database.get.mock.calls[0][0]).toContain("AVG(grade)");
  });

  it("validates student IDs and allows the matching authenticated student", () => {
    const request = { params: { studentId: "7" } };
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    validateStudentIdParam(request, response, next);
    request.user = { id: 7 };
    requireOwnStudentAverage(request, response, next);

    expect(request.validatedStudentId).toBe(7);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("denies access to another student's average", () => {
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    requireOwnStudentAverage(
      { user: { id: 9 }, validatedStudentId: 7 },
      response,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "You may only view your own average",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns the average in the standard success envelope", async () => {
    const service = createGradeAverageService({
      calculateByStudentId: vi.fn().mockResolvedValue({
        average: 89.25,
        grade_count: 4,
      }),
    });
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await createGradeAverageController(service)(
      { validatedStudentId: 7 },
      response,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      message: "Student average retrieved",
      data: { student_id: 7, average: 89.25, grade_count: 4 },
    });
    expect(next).not.toHaveBeenCalled();
  });
});

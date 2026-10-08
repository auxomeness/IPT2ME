import { describe, expect, it, vi } from "vitest";
import { createDatabase } from "../src/db/connection.js";
import { SubjectModel } from "../src/models/Subject.js";
import {
  validateSubjectInput,
  validateSubjectSearch,
} from "../src/validators/subjectValidator.js";

describe("subject listing, search, and validation", () => {
  it("lists and searches subjects by name, instructor, and section", () => {
    const database = createDatabase(":memory:");
    database.prepare(
      "INSERT INTO subjects (name, instructor, section) VALUES (?, ?, ?)",
    ).run("Algebra", "Jordan Lee", "MATH-1A");
    database.prepare(
      "INSERT INTO subjects (name, instructor, section) VALUES (?, ?, ?)",
    ).run("Biology", "Sam Rivera", "SCI-2B");
    const subjects = new SubjectModel(database);

    expect(subjects.list()).toHaveLength(2);
    expect(subjects.search("jordan").map((subject) => subject.name)).toEqual([
      "Algebra",
    ]);
    expect(subjects.search("SCI-2B").map((subject) => subject.name)).toEqual([
      "Biology",
    ]);
    database.close();
  });

  it("rejects incomplete subject information and trims valid fields", () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();
    const invalidRequest = { body: { name: "Algebra", instructor: "" } };

    validateSubjectInput(invalidRequest, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();

    const validRequest = {
      body: { name: " Algebra ", instructor: " Jordan Lee ", section: " 1A " },
    };
    validateSubjectInput(validRequest, response, next);
    expect(validRequest.body).toEqual({
      name: "Algebra",
      instructor: "Jordan Lee",
      section: "1A",
    });
    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects a blank search query", () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    validateSubjectSearch({ query: { q: "  " } }, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});

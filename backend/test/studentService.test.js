import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDatabase } from "../src/db/connection.js";
import { StudentModel } from "../src/models/studentModel.js";
import { StudentService } from "../src/services/studentService.js";

const secret = "student-service-test-secret-with-at-least-32-bytes";

describe("StudentService", () => {
  let database;
  let students;
  let service;

  beforeEach(() => {
    database = createDatabase(":memory:");
    students = new StudentModel(database);
    service = new StudentService(students, secret);
  });

  afterEach(() => database.close());

  it("authenticates a student and returns a limited profile and signed token", async () => {
    const created = await students.create("sam", "safe-password");

    const result = await service.login("sam", "safe-password");

    expect(result.student).toEqual(created);
    expect(jwt.verify(result.token, secret)).toMatchObject({
      sub: String(created.id),
      role: "student",
    });
  });

  it("rejects invalid usernames and passwords", async () => {
    await students.create("sam", "safe-password");

    await expect(service.login("sam", "wrong-password")).resolves.toBeNull();
    await expect(service.login("missing", "wrong-password")).resolves.toBeNull();
  });

  it("includes the stored role in tokens for grade writers", async () => {
    const instructor = await students.create("teacher", "safe-password", "instructor");
    const result = await service.login("teacher", "safe-password");

    expect(result.student).toEqual(instructor);
    expect(jwt.verify(result.token, secret).role).toBe("instructor");
  });
});

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "vitest";
import { createDatabase } from "../src/db/connection.js";
import { StudentModel } from "../src/models/studentModel.js";

describe("StudentModel", () => {
  let database;
  let students;

  beforeEach(() => {
    database = createDatabase(":memory:");
    students = new StudentModel(database);
  });

  afterEach(() => {
    database.close();
  });

  it("creates a student and retrieves it by id and username", () => {
    const created = students.create("sam", "$2b$10$example-hash");

    assert.deepEqual(created, { id: 1, username: "sam" });
    assert.deepEqual(students.findById(created.id), {
      id: 1,
      username: "sam",
      password_hash: "$2b$10$example-hash"
    });
    assert.deepEqual(students.findByUsername("sam"), {
      id: 1,
      username: "sam",
      password_hash: "$2b$10$example-hash"
    });
  });

  it("returns no record for an unknown student", () => {
    assert.equal(students.findById(404), undefined);
    assert.equal(students.findByUsername("missing"), undefined);
  });

  it("lists safe student records without password hashes", () => {
    students.create("sam", "hash-one");
    students.create("lee", "hash-two");

    assert.deepEqual(students.list(), [
      { id: 1, username: "sam" },
      { id: 2, username: "lee" }
    ]);
  });

  it("enforces unique usernames in SQLite", () => {
    students.create("sam", "hash-one");

    assert.throws(() => students.create("sam", "hash-two"), /UNIQUE constraint failed/);
  });
});

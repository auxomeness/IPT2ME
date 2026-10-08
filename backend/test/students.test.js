import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
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

  it("hashes the password before saving and retrieves the student by id and username", async () => {
    const created = await students.create("sam", "correct horse battery staple");
    const storedById = students.findById(created.id);
    const storedByUsername = students.findByUsername("sam");

    assert.deepEqual(created, { id: 1, username: "sam" });
    assert.deepEqual(storedById, {
      id: 1,
      username: "sam",
      password_hash: storedById.password_hash
    });
    assert.deepEqual(storedByUsername, {
      id: 1,
      username: "sam",
      password_hash: storedById.password_hash
    });
    assert.notEqual(storedById.password_hash, "correct horse battery staple");
    assert.equal(
      await bcrypt.compare("correct horse battery staple", storedById.password_hash),
      true
    );
  });

  it("returns no record for an unknown student", () => {
    assert.equal(students.findById(404), undefined);
    assert.equal(students.findByUsername("missing"), undefined);
  });

  it("lists safe student records without password hashes", async () => {
    await students.create("sam", "password-one");
    await students.create("lee", "password-two");

    assert.deepEqual(students.list(), [
      { id: 1, username: "sam" },
      { id: 2, username: "lee" }
    ]);
  });

  it("enforces unique usernames in SQLite", async () => {
    await students.create("sam", "password-one");

    await assert.rejects(
      students.create("sam", "password-two"),
      /UNIQUE constraint failed/
    );
  });

  it("rejects passwords longer than bcrypt's supported input size", async () => {
    await assert.rejects(
      students.create("sam", "x".repeat(73)),
      /72 UTF-8 bytes/
    );
  });
});

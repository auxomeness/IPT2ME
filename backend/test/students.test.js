import { afterEach, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { createDatabase } from "../src/db/connection.js";
import { initializeDatabase } from "../src/db/initialize.js";
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

  it("hashes passwords and retrieves students by id and username", async () => {
    const created = await students.create("sam", "correct horse battery staple");

    expect(created).toEqual({ id: 1, username: "sam", role: "student" });
    expect(students.findById(created.id)).toEqual({
      id: 1,
      username: "sam",
      role: "student",
    });
    expect(students.findByUsername("sam")).toEqual({
      id: 1,
      username: "sam",
      password_hash: expect.any(String),
      role: "student",
    });
    expect(students.findByUsername("sam").password_hash).not.toContain(
      "correct horse battery staple",
    );
    await expect(
      bcrypt.compare(
        "correct horse battery staple",
        students.findByUsername("sam").password_hash,
      ),
    ).resolves.toBe(true);
  });

  it("returns no record for an unknown student", () => {
    expect(students.findById(404)).toBeUndefined();
    expect(students.findByUsername("missing")).toBeUndefined();
  });

  it("lists safe student records without password hashes", async () => {
    await students.create("sam", "password-one");
    await students.create("lee", "password-two");

    expect(students.list()).toEqual([
      { id: 1, username: "sam" },
      { id: 2, username: "lee" },
    ]);
  });

  it("enforces unique usernames in SQLite", async () => {
    await students.create("sam", "password-one");

    await expect(students.create("sam", "password-two")).rejects.toThrow(
      /UNIQUE constraint failed/,
    );
  });

  it("adds the default student role to existing database files", () => {
    const legacyDatabase = new Database(":memory:");
    legacyDatabase.exec(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      )
    `);

    initializeDatabase(legacyDatabase);

    expect(legacyDatabase.prepare("PRAGMA table_info(students)").all()).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "role" })]),
    );
    expect(
      legacyDatabase.prepare("INSERT INTO students (username, password_hash) VALUES (?, ?)").run("legacy", "hash").changes,
    ).toBe(1);
    expect(
      legacyDatabase.prepare("SELECT role FROM students WHERE username = ?").get("legacy").role,
    ).toBe("student");
    legacyDatabase.close();
  });
});

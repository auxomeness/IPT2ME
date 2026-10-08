import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, it } from "vitest";
import { createApp } from "../src/app.js";
import { createDatabase } from "../src/db/connection.js";
import { StudentModel } from "../src/models/Student.js";
import { StudentService } from "../src/services/studentService.js";

const jwtSecret = "test-secret-with-at-least-thirty-two-bytes";

describe("POST /api/students/login", () => {
  let database;
  let server;
  let baseUrl;

  beforeEach(async () => {
    database = createDatabase(":memory:");
    const students = new StudentModel(database);
    const hash = await bcrypt.hash("correct-password", 4);
    students.create("student1", hash);
    const app = createApp({
      studentService: new StudentService(students, jwtSecret)
    });

    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterEach(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
    database.close();
  });

  async function login(payload) {
    return fetch(`${baseUrl}/api/students/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  it("verifies the password and returns a signed token and safe student record", async () => {
    const response = await login({
      username: "student1",
      password: "correct-password"
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.student.id, 1);
    assert.equal(body.data.student.username, "student1");
    assert.equal("password_hash" in body.data.student, false);
    assert.equal("password" in body.data.student, false);

    const claims = jwt.verify(body.data.token, jwtSecret, {
      algorithms: ["HS256"]
    });
    assert.equal(claims.sub, "1");
  });

  it("returns the same generic failure for unknown users and wrong passwords", async () => {
    const wrongPassword = await login({
      username: "student1",
      password: "incorrect-password"
    });
    const missingUser = await login({
      username: "unknown",
      password: "incorrect-password"
    });
    const wrongBody = await wrongPassword.json();
    const missingBody = await missingUser.json();

    assert.equal(wrongPassword.status, 401);
    assert.equal(missingUser.status, 401);
    assert.deepEqual(wrongBody, missingBody);
  });

  it("rejects missing or invalid credentials", async () => {
    const response = await login({ username: " ", password: "" });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.deepEqual(body.errors, ["Username is required", "Password is required"]);
  });

  it("rejects oversized request bodies with a client error", async () => {
    const response = await login({
      username: "student1",
      password: "x".repeat(17 * 1024)
    });

    assert.equal(response.status, 413);
    assert.deepEqual(await response.json(), {
      success: false,
      message: "Request body too large",
      errors: []
    });
  });
});

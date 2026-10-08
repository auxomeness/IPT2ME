import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "vitest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app.js";
import { createDatabase } from "../src/db/connection.js";
import { StudentModel } from "../src/models/studentModel.js";
import { StudentService } from "../src/services/studentService.js";

const jwtSecret = "test-secret-with-at-least-thirty-two-bytes";

describe("GET /api/students", () => {
  let database;
  let server;
  let baseUrl;

  beforeEach(async () => {
    database = createDatabase(":memory:");
    const students = new StudentModel(database);
    students.create("sam", "$2b$10$hash-one");
    students.create("lee", "$2b$10$hash-two");
    const app = createApp({
      studentService: new StudentService(students),
      jwtSecret,
      frontendOrigin: "http://localhost:5173"
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

  async function getStudents(token) {
    return fetch(`${baseUrl}/api/students`, {
      headers: token ? { authorization: `Bearer ${token}` } : {}
    });
  }

  it("returns student IDs and usernames for a valid bearer token", async () => {
    const token = jwt.sign({ sub: "1" }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "1h"
    });
    const response = await getStudents(token);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      success: true,
      message: "Request successful",
      data: [
        { id: 1, username: "sam" },
        { id: 2, username: "lee" }
      ]
    });
  });

  it("rejects missing, invalid, and expired bearer tokens", async () => {
    const missing = await getStudents();
    const invalid = await getStudents("not-a-token");
    const expiredToken = jwt.sign({ sub: "1" }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: -1
    });
    const expired = await getStudents(expiredToken);

    assert.equal(missing.status, 401);
    assert.equal(invalid.status, 401);
    assert.equal(expired.status, 401);
  });
});

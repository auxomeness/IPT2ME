import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { initializeDatabase } from "./initialize.js";

export function createDatabase(databasePath) {
  if (databasePath !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const database = new Database(databasePath);
  database.pragma("foreign_keys = ON");
  initializeDatabase(database);
  return database;
}

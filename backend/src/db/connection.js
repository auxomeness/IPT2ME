import "dotenv/config";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const defaultDatabasePath = fileURLToPath(
  new URL("../../data/grades.db", import.meta.url),
);
const backendDirectory = fileURLToPath(new URL("../..", import.meta.url));
const databasePath = process.env.DATABASE_PATH
  ? resolve(backendDirectory, process.env.DATABASE_PATH)
  : defaultDatabasePath;

mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    instructor TEXT NOT NULL,
    section TEXT NOT NULL
  )
`);

export default database;

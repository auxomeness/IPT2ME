import { mkdir } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";

const DEFAULT_DATABASE_PATH = fileURLToPath(
  new URL("../../data/grades.sqlite", import.meta.url),
);

/** Open the shared SQLite database and enable foreign-key checks. */
export async function openDatabase(databasePath = process.env.SQLITE_DB_PATH) {
  const configuredPath = databasePath || DEFAULT_DATABASE_PATH;
  const filename =
    configuredPath === ":memory:"
      ? configuredPath
      : isAbsolute(configuredPath)
        ? configuredPath
        : resolve(process.cwd(), configuredPath);

  if (filename !== ":memory:") {
    await mkdir(dirname(filename), { recursive: true });
  }

  return new Promise((resolveDatabase, reject) => {
    const database = new sqlite3.Database(filename, (error) => {
      if (error) {
        reject(error);
        return;
      }

      database.run("PRAGMA foreign_keys = ON", (pragmaError) => {
        if (pragmaError) {
          database.close(() => reject(pragmaError));
          return;
        }

        resolveDatabase(database);
      });
    });
  });
}

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";

const backendRoot = fileURLToPath(new URL("../../", import.meta.url));

export async function openDatabase() {
  const configuredPath = process.env.SQLITE_DB_PATH || "data/grades.sqlite";
  const databasePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(backendRoot, configuredPath);

  await mkdir(path.dirname(databasePath), { recursive: true });

  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(database);
    });
  });
}

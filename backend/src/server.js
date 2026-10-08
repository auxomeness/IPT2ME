import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabase } from "./db/connection.js";
import createRoutes from "./routes/routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const backendDirectory = fileURLToPath(new URL("..", import.meta.url));
const databasePath = process.env.DATABASE_PATH
  ? path.resolve(backendDirectory, process.env.DATABASE_PATH)
  : path.join(backendDirectory, "data", "grades.db");
const database = createDatabase(databasePath);

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.use("/api", createRoutes(database));

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

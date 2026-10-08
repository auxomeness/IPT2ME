import dotenv from "dotenv";
import { createApp } from "./app.js";
import { createDatabase } from "./db/connection.js";
import { StudentModel } from "./models/Student.js";
import { StudentService } from "./services/studentService.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 bytes");
}

const database = createDatabase(process.env.DATABASE_PATH || "./data/grades.sqlite");
const studentService = new StudentService(new StudentModel(database), jwtSecret);
const port = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const app = createApp({ studentService, frontendOrigin });

const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

function closeServer() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);

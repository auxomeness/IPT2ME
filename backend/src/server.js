import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabase, openGradeDatabase } from "./db/connection.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { createStudentAuthenticator } from "./middleware/authMiddleware.js";
import { createGradeAverageModel } from "./models/gradeAverageModel.js";
import { createGradeModel } from "./models/gradeModel.js";
import { StudentModel } from "./models/studentModel.js";
import { SubjectModel } from "./models/Subject.js";
import { StudentService } from "./services/studentService.js";
import { createGradeService } from "./services/gradeService.js";
import { createGradeRouter } from "./routes/gradeRoutes.js";
import { createGradeAverageRouter } from "./routes/gradeAverageRoutes.js";
import createRoutes from "./routes/routes.js";
import { createGradeAverageService } from "./services/gradeAverageService.js";

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
async function startServer() {
  let gradeDatabase;

  try {
    gradeDatabase = await openGradeDatabase(databasePath);
    const gradeModel = createGradeModel(gradeDatabase);
    await gradeModel.initialize();

    const students = new StudentModel(database);
    const subjects = new SubjectModel(database);
    const studentService = new StudentService(students, process.env.JWT_SECRET);
    const authenticateStudent = createStudentAuthenticator(process.env.JWT_SECRET);
    app.use(
      "/api",
      createRoutes(database, { studentService, authenticateStudent }),
    );

    const gradeService = createGradeService({
      gradeModel,
      gradeReferences: {
        ensureStudentExists: async (id) => Boolean(students.findById(id)),
        ensureSubjectExists: async (id) => Boolean(subjects.findById(id)),
      },
    });
    app.use(
      "/api",
      createGradeRouter(gradeService, authenticateStudent),
    );

    const gradeAverageModel = createGradeAverageModel(gradeDatabase);
    const gradeAverageService = createGradeAverageService(gradeAverageModel);

    app.use(
      "/api",
      createGradeAverageRouter(gradeAverageService, authenticateStudent),
    );
    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  } catch (error) {
    if (gradeDatabase) {
      gradeDatabase.close();
    }
    database.close();

    console.error(`Backend failed to start: ${error.message}`);
    process.exitCode = 1;
  }
}

startServer();

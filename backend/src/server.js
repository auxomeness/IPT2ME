import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openDatabase } from "./db/connection.js";
import { createGradeModel } from "./models/gradeModel.js";
import { createMockGradeReferences } from "./models/mockGradeReferences.js";
import { createGradeRouter } from "./routes/gradeRoutes.js";
import routes from "./routes/routes.js";
import { createGradeService } from "./services/gradeService.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.use("/api", routes);

async function startServer() {
  let database;

  try {
    database = await openDatabase();
    const gradeReferences = await createMockGradeReferences(database);
    const gradeModel = createGradeModel(database);

    await gradeModel.initialize();

    const gradeService = createGradeService({ gradeModel, gradeReferences });
    app.use("/api", createGradeRouter(gradeService));

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  } catch (error) {
    if (database) {
      database.close();
    }

    console.error(`Backend failed to start: ${error.message}`);
    process.exitCode = 1;
  }
}

startServer();

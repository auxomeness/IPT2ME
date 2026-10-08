import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createGradeRouter } from "./routes/gradeRoutes.js";
import { createGradeService } from "./services/gradeService.js";
import { openDatabase } from "./db/connection.js";
import { createGradeModel } from "./models/gradeModel.js";
import routes from "./routes/routes.js";

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
    const gradeModel = createGradeModel(database);
    await gradeModel.initialize();

    app.use("/api", createGradeRouter(createGradeService(gradeModel)));

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

import cors from "cors";
import express from "express";
import routes from "./routes/routes.js";

export function createApp({ studentService, jwtSecret, frontendOrigin }) {
  const app = express();

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json());
  app.use("/api", routes({ studentService, jwtSecret }));

  return app;
}

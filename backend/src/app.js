import cors from "cors";
import express from "express";
import routes from "./routes/routes.js";

export function createApp({ studentService, frontendOrigin = "http://localhost:5173" }) {
  const app = express();

  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json({ limit: "16kb" }));
  app.use("/api", routes({ studentService }));

  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    if (error.type === "entity.parse.failed" || (error instanceof SyntaxError && "body" in error)) {
      return response.status(400).json({
        success: false,
        message: "Invalid JSON request",
        errors: []
      });
    }

    if (error.type === "entity.too.large") {
      return response.status(413).json({
        success: false,
        message: "Request body too large",
        errors: []
      });
    }

    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Internal server error",
      errors: []
    });
  });

  return app;
}

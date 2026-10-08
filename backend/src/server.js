import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

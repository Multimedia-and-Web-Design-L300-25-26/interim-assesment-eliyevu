import express from "express";
import cors from "cors";
import pkg from "cookie-parser";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";

const cookieParser = pkg;

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// Routes 
app.use("/api", authRoutes) 

app.use(notFound);
app.use(errorHandler);

export default app;
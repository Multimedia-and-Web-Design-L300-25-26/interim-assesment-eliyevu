import express from "express";
import cors from "cors";
import pkg from "cookie-parser";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import cryptoRoutes from "./src/routes/cryptoRoutes.js";

const cookieParser = pkg;
// Initialize Express app
const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// Routes 
app.use("/api", authRoutes); 
app.use("/api/crypto", cryptoRoutes);

// Error handling middleware  
app.use(notFound);
app.use(errorHandler);

export default app;
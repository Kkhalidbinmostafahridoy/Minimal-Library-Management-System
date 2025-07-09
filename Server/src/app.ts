import express, { type Request, type Response } from "express";
// using  type Request, type Response as remove error for build
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes";
import borrowRoutes from "./routes/borrowRoutes";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:4173",
      "http://localhost:5173",
      "https://m-library-m-system-client.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Log middleware
app.use((req, _res, next) => {
  console.log("Incoming request body:", req.body);
  next();
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Minimal Library Management System");
});

app.use(errorHandler);

export default app;

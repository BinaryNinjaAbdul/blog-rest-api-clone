import express, { Error, Request, Response, NextFunction } from "express";

import bookRoutes from "./routes/bookRoutes";
import authRoutes from "./routes/authRoutes";
import AppError from "./utils/appError";
import { globalErrorHandler } from "./controller/errorController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/books", bookRoutes);
app.use("/auth", authRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this serer!`, 404));
});

app.use(globalErrorHandler);

export default app;

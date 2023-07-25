import { Error, Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  return res.status(404).json({
    status: err.statusCode,
    message: err.message,
  });
};

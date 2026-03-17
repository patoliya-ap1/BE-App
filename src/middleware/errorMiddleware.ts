import { AppError } from "../utility/AppError.js";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { logger } from "../utility/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!error) {
    return next();
  }

  error.message = error.message || "internal server error";
  error.statusCode = error.statusCode || 500;

  if (error.name === "CastError") {
    const message = `Resource not found. Invalid ${error.path}`;
    error = new AppError(message, 400);
  }

  if (error.name === "ValidationError") {
    const message =
      (Object.values(error.errors)[0] as { message: string }).message ||
      "validation error";
    error = new AppError(message, 400);
  }

  if (error.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again.";
    error = new AppError(message, 400);
  }

  if (error.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Try again.";
    error = new AppError(message, 400);
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(error.statusCode).json({ success: false, message: error.message });
};

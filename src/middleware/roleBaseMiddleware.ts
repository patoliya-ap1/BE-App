import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utility/AppError.js";
export const roleBaseMiddleware = (...roles: [string]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.role || "")) {
      const message = `access denied for role ${req.role}`;
      const err = new AppError(message, 401);
      return next(err);
    }
    next();
  };
};

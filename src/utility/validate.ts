import { validationResult } from "express-validator";
import { AppError } from "./AppError.js";
import type { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array()[0]?.msg;
    const err = new AppError(errorMsg, 400);
    return next(err);
  }
  next();
};

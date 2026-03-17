import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utility/AppError.js";
export const verifiedUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.emailConfirmed) {
    const err = new AppError("only verified user can access resource", 401);
    next(err);
  }
  next();
};

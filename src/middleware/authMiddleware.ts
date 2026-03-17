import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utility/AppError.js";
import jwt from "jsonwebtoken";
import type { DecodedToken } from "../utility/Type.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      const err = new AppError("token required for access resource", 404);
      return next(err);
    }

    const decodedToken = jwt.verify(token, JWT_SECRET || "");

    if (decodedToken) {
      req.email = (decodedToken as DecodedToken).email || "";
      req.role = (decodedToken as DecodedToken).role || "";
      req.emailConfirmed = (decodedToken as DecodedToken).emailConfirmed || "";
      return next();
    }
  } catch (error) {
    next(error);
  }
};

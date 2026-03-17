import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utility/AppError.js";
export const roleBaseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const imageFile = req.file?.buffer;
  if (!imageFile) {
    return next();
  } else {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(req.file?.mimetype.split("/")[1] || "");
    const imageSize =
      (req.file?.size && Number((req.file?.size / 1024 ** 2).toFixed(2))) || 0;

    if (!mimetype) {
      const err = new AppError(
        "please upload image file *jpeg , jpg , png , gif ",
        400,
      );
      return next(err);
    }

    if (imageSize > 1) {
      const err = new AppError("please upload image size less than 1 MB", 400);
      return next(err);
    }
    next();
  }
};

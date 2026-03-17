import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import type { Request, Response, NextFunction } from "express";

export const streamTextController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const textFilePath = path.join(
    __dirname,
    "..",
    "assets",
    "file",
    "largeText.txt",
  );

  const readStream = fs.createReadStream(textFilePath, { highWaterMark: 1024 });

  readStream.on("data", (chunk) => {
    readStream.pause();
    setTimeout(() => {
      res.write(chunk);
      readStream.resume();
    }, 1000);
  });

  readStream.on("end", () => {
    res.end();
  });

  readStream.on("error", (error) => {
    next(error);
  });
};

export const streamImageController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const textFilePath = path.join(
    __dirname,
    "..",
    "assets",
    "image",
    "jungle.jpg",
  );

  const readStream = fs.createReadStream(textFilePath, {
    highWaterMark: 64 * 1024,
  });

  readStream.on("data", (chunk) => {
    readStream.pause();
    setTimeout(() => {
      res.write(chunk);
      readStream.resume();
    }, 1000);
  });

  readStream.on("end", () => {
    res.end();
  });

  readStream.on("error", (error) => {
    next(error);
  });
};

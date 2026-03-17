import express from "express";
import {
  streamImageController,
  streamTextController,
} from "../../controller/streamController.js";

export const streamRouter = express.Router();

// stream text
streamRouter.get("/text", streamTextController);

// stream image
streamRouter.get("/image", streamImageController);

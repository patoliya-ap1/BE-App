import express from "express";
import { postsRouter } from "./posts/postsRoutes.js";
import { authRouter } from "./auth/authRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { profileRouter } from "./profile/profileRoutes.js";
import { streamRouter } from "./stream/streamRoutes.js";
import { verifiedUserMiddleware } from "../middleware/verifiedUserMiddleware.js";
import { rateLimitPosts } from "../middleware/rateLimitMiddleware.js";

export const mainRouter = express.Router();

mainRouter.use("/posts", rateLimitPosts, postsRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use(
  "/profile",
  authMiddleware,
  verifiedUserMiddleware,
  profileRouter,
);
mainRouter.use("/stream", streamRouter);

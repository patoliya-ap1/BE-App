import { redisCacheClient } from "../services/redisCacheClient.js";
import type { Request, Response, NextFunction } from "express";

export const postCacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cacheKey = JSON.stringify(req.query);
  const postsStringData = await redisCacheClient.get(cacheKey);
  if (postsStringData === null) {
    return next();
  }
  const JsonResponse = JSON.parse(postsStringData);
  const { posts, ...rest } = JsonResponse;
  res.status(200).json({ rest, posts: JSON.parse(posts), from: "redis cache" });
};

import { LikeModel } from "../models/likes.model.js";
import { PostModel } from "../models/posts.model.js";
import { redisCacheClient } from "../services/redisCacheClient.js";
import { AppError } from "../utility/AppError.js";
import type { Request, Response, NextFunction } from "express";

export const getPostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // query pagination and filters

  const q = (req.query.q as string) || "";
  const sortQuery = req.query.sort as string;
  const sortByDate = sortQuery === "desc" ? -1 : sortQuery === "asc" ? 1 : "";
  const tags = (req.query.tags as string[]) || [];
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string) || 6;
  const skip = ((page || 1) - 1) * limit;

  type FIlter = {
    title?: Record<string, unknown>;
    tags?: Record<string, unknown>;
  };

  const filterObj: FIlter = {};

  if (q) {
    filterObj.title = { $regex: q, $options: "i" };
  }
  if (tags.length > 0) {
    filterObj.tags = { $in: tags };
  }

  try {
    // total posts
    const totalPosts = await PostModel.find().countDocuments();

    // allPosts / filtered post
    const posts = await PostModel.find(filterObj)
      .sort({ createdAt: sortByDate || -1 })
      .skip(skip || 0)
      .limit(limit);
    if (!posts) {
      const err = new AppError("error while fetching post", 400);
      return next(err);
    }

    // add redis caching for filters

    const resObjectForCaching = {
      success: true,
      message: "posts fetched successfully.",
      totalPosts,
      currentPage: page || 1,
      posts: JSON.stringify(posts),
    };

    if (tags.length > 0 || q || page || sortQuery) {
      const cacheKey = JSON.stringify(req.query);

      await redisCacheClient.set(
        cacheKey,
        JSON.stringify(resObjectForCaching),
        {
          expiration: { type: "EX", value: 60 * 60 },
        },
      );
      console.log("caching successfully for filters");
    }

    res.status(200).json({
      success: true,
      message: "posts fetched successfully.",
      totalPosts,
      currentPage: page || 1,
      posts,
      from: "mongodb database",
    });
  } catch (error) {
    next(error);
  }
};

export const addPostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postData = req.body;
  try {
    const newPost = new PostModel(postData);
    const savedPost = await newPost.save();
    if (!savedPost) {
      const err = new AppError("error while creating post", 400);
      return next(err);
    }
    res.status(201).json({
      success: true,
      message: "new post created successfully.",
      newPost: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.id;
  const postUpdateData = req.body;
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      postUpdateData,
      { new: true, runValidators: true },
    );
    if (!updatedPost) {
      const err = new AppError("error while updating post", 400);

      return next(err);
    }
    res.status(201).json({
      success: true,
      message: "new post created successfully.",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.id;
  try {
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      const err = new AppError("error while deleting post", 400);
      return next(err);
    }
    res.status(200).json({
      success: false,
      message: "post deleted successfully.",
      deletedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const likePostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.id || "";
  const { userId } = req.body;
  try {
    const alreadyLiked = await LikeModel.findOne({ postId, userId });

    if (alreadyLiked) {
      return res.status(409).json({
        success: true,
        message: `you already like this post ${postId}`,
      });
    }

    const newLike = new LikeModel({ postId, userId });
    const savedLike = await newLike.save();
    if (!savedLike) {
      const err = new AppError("error while like post", 400);
      return next(err);
    }
    res
      .status(201)
      .json({ success: true, message: `you liked this post ${postId}` });
  } catch (error) {
    next(error);
  }
};

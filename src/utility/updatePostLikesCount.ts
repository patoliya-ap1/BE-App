import { LikeModel } from "../models/likes.model.js";
import { PostModel } from "../models/posts.model.js";
import { logger } from "./logger.js";

export const updatePostLikesCount = async () => {
  try {
    const postIds = await PostModel.find({}, { postId: 1 });

    postIds.forEach(async ({ _id: postId }) => {
      const likeCount = await LikeModel.find({ postId }).countDocuments();
      const updatePost = await PostModel.findByIdAndUpdate(
        postId,
        { likeCount },
        { returnDocument: "after" },
      );
      if (!updatePost) {
        throw new Error("error while updating post");
      }
    });
    logger.info("like updated successfully after 12 hour");
  } catch (error) {
    logger.error(error || "unknown error while update likes");
  }
};

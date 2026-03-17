import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "postId is required"],
    },
  },
  { timestamps: true },
);

export const LikeModel = mongoose.model("likes", likeSchema);

import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    body: { type: String, required: [true, "body is required"] },
    tags: { type: [String], default: [] },
    likeCount: { type: Number, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required"],
    },
  },
  { timestamps: true },
);

export const PostModel = mongoose.model("posts", postSchema);

import { SignUpModel } from "../models/signup.model.js";
import { AppError } from "../utility/AppError.js";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cloudinary from "../utility/cloudinaryConfig.js";
import { extractPublicId } from "cloudinary-build-url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL;

// get profile by id

export const getProfileByIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.id;
  try {
    const user = await SignUpModel.findById(userId);
    if (!user) {
      const err = new AppError("error while getting user", 400);
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// update profile

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.id;
  const { password, ...updateData } = req.body;
  const imageFile = req.file?.buffer;
  try {
    const isUserExist = await SignUpModel.findById(userId);

    if (!isUserExist) {
      const err = new AppError(`user not found with id ${userId}`, 404);
      return next(err);
    }

    if (isUserExist && isUserExist.email !== req.email) {
      const err = new AppError(`access denied for update profile`, 401);
      return next(err);
    }

    if (imageFile) {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(req.file?.mimetype.split("/")[1] || "");
      const imageSize =
        (req.file?.size && Number((req.file?.size / 1024 ** 2).toFixed(2))) ||
        0;

      if (!mimetype) {
        const err = new AppError(
          "please upload image file *jpeg , jpg , png , gif ",
          400,
        );
        return next(err);
      }

      if (imageSize > 1) {
        const err = new AppError(
          "please upload image size less than 1 MB",
          400,
        );
        return next(err);
      }

      // compress and upload image

      if (!process.env.CLOUDINARY_API_SECRET) {
        const compressedPath = path.join(
          __dirname,
          "..",
          "assets",
          "compressedImages",
          `${isUserExist.profilePicture ? isUserExist.profilePicture.split("/").at(-1) : `profile-${Date.now()}.jpg`}`,
        );
        await sharp(imageFile)
          .resize(400, 400)
          .jpeg({ quality: 70 })
          .toFile(compressedPath);
        const imageNameWithExtension = path.basename(compressedPath);
        const imgUrl = `${BACKEND_URL}/images/${imageNameWithExtension}`;
        updateData.profilePicture = imgUrl;
      } else {
        const compressedBuffer = await sharp(imageFile)
          .resize(400)
          .jpeg({ quality: 70 })
          .toBuffer();

        if (isUserExist.profilePicture) {
          const publicId = extractPublicId(isUserExist.profilePicture);
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        }

        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`,
          {
            folder: "ProfilePicture",
          },
        );

        updateData.profilePicture = result.url;
      }
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const updatedProfile = await SignUpModel.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: "after" },
    );

    if (!updatedProfile) {
      const err = new AppError("error while updating profile", 400);
      return next(err);
    }
    res
      .status(201)
      .json({ success: true, message: "profile updated successfully." });
  } catch (error) {
    next(error);
  }
};

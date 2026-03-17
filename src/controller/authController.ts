import { SignUpModel } from "../models/signup.model.js";
import { AppError } from "../utility/AppError.js";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { EmailDecodedToken } from "../utility/Type.js";
import { emailQueue } from "../queue/emailQueue.js";
import { smsQueue } from "../queue/smsQueue.js";
import { publisher } from "../services/redisPublisher.js";
import { generateEmailTemplate } from "../utility/generateEmailTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const isUserExist = await SignUpModel.findOne({ email });
    if (!isUserExist) {
      const err = new AppError(`user not found with email ${email}`, 404);
      return next(err);
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, isUserExist.password);

    if (!passwordMatch) {
      const err = new AppError(`invalid credentials`, 401);
      return next(err);
    }
    if (!JWT_SECRET) {
      const err = new AppError(`please provide JWT_SECRET variable`, 404);
      return next(err);
    }

    const accessToken = jwt.sign(
      {
        email,
        role: isUserExist.role || "user",
        emailConfirmed: isUserExist.emailConfirmed,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res
      .status(200)
      .json({ success: true, message: "login success", accessToken });
  } catch (error) {
    next(error);
  }
};

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password, ...rest } = req.body;
  try {
    if (!password || !password?.trim()) {
      const err = new AppError("password is required", 400);
      return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new SignUpModel({ ...rest, password: hashedPassword });

    const emailVerifyToken = jwt.sign({ email: rest.email }, JWT_SECRET || "", {
      expiresIn: "24h",
    });

    const url = `${BACKEND_URL}/auth/verify/${emailVerifyToken}`;

    const emailTemplate = generateEmailTemplate(url);

    const savedUser = await newUser.save();
    if (!savedUser) {
      const err = new AppError("error while signup", 400);
      return next(err);
    }

    const mailSend = await emailQueue.add(
      "sendVerificationEmail",
      {
        email: rest.email,
        subject: "Verify Email Address",
        template: emailTemplate,
      },
      { attempts: 2 },
    );

    if (rest.phoneNumber) {
      const smsSend = await smsQueue.add(
        "sendVerificationSMS",
        {
          body: "Please verify your email for access resource",
          to: rest.phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER as string,
        },
        { attempts: 2 },
      );

      if (!smsSend) {
        return res.status(201).json({
          success: true,
          message: "signup successfully.",
          issue: "issue in sending sms",
        });
      }
    }

    if (!mailSend) {
      const err = new AppError("error while sending verify email", 400);
      return next(err);
    }

    res.status(201).json({ success: true, message: "signup successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.params.id;
  const { password, ...updateData } = req.body;
  const imageFile = req.file?.buffer;
  try {
    if (imageFile) {
      const compressedPath = path.join(
        __dirname,
        "assets",
        "compressedImages",
        `profile-${Date.now()}.jpg`,
      );
      await sharp(imageFile).jpeg({ quality: 70 }).toFile(compressedPath);
      updateData.profilePicture = compressedPath;
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

export const emailTokenVerifyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const emailToken: string = req.params.token as string;
  try {
    const decodeToken = jwt.verify(
      emailToken,
      JWT_SECRET || "",
    ) as EmailDecodedToken;
    if (!decodeToken) {
      const err = new AppError("failed to verify email", 400);
      return next(err);
    }

    const verifyUser = await SignUpModel.findOneAndUpdate(
      { email: decodeToken.email || "" },
      { emailConfirmed: true },
    );

    if (!verifyUser) {
      const err = new AppError("error while verifying user", 400);
      return next(err);
    }

    const eventData = JSON.stringify({
      event: "user.signup",
      payload: {
        email: decodeToken.email,
        subject: "welcome message",
        template: `<h1>Welcome to Company</h1>`,
      },
    });

    await publisher.publish("welcome-email", eventData);

    res.status(200).json({
      success: true,
      message: "email verified successfully ,check your email",
    });
  } catch (error) {
    next(error);
  }
};

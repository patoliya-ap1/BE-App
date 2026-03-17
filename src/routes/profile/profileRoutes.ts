import express from "express";
import multer from "multer";
import {
  getProfileByIDController,
  updateProfileController,
} from "../../controller/profileController.js";
import { profileImageValidateMiddleware } from "../../middleware/profileImageValidateMiddleware.js";
const upload = multer({ storage: multer.memoryStorage() });

export const profileRouter = express.Router();

/**
 * @swagger
 * /profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: user fetched successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The user's username.
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       description: The user's role.
 *                       enum: [user, admin]
 *                       default: user
 *                       example: user
 *                     profilePicture:
 *                       type: string
 *                       description: URL to the user's profile picture.
 *                       example: https://example.com
 *                     emailConfirmed:
 *                       type: boolean
 *                       description: Whether the user's email is confirmed.
 *                       default: false
 *                       example: true
 *                     phoneNumber:
 *                       type: string
 *                       description: The user's phone number.
 *                       example: "1234567890"
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
profileRouter.get("/:id", getProfileByIDController);

/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update profile by ID
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, role, emailConfirmed]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 10
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *               profilePicture:
 *                 type: string
 *               emailConfirmed:
 *                 type: boolean
 *                 default: false
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: profile updated successfully.
 */
profileRouter.put(
  "/:id",
  upload.single("profile-picture"),
  profileImageValidateMiddleware,
  updateProfileController,
);

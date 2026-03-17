import express from "express";
import {
  emailTokenVerifyController,
  loginController,
  signupController,
} from "../../controller/authController.js";

import {
  loginValidator,
  signupValidator,
} from "../../middleware/expressValidatorMiddleware.js";
import { validate } from "../../utility/validate.js";

export const authRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 */

authRouter.post("/login", loginValidator, validate, loginController);

/**
 * @swagger
 * paths:
 *   /auth/signup:
 *     post:
 *       summary: User registration
 *       description: Register a new user account.
 *       tags:
 *         - Auth
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - username
 *                 - email
 *                 - password
 *                 - role
 *                 - emailConfirmed
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Unique username (required).
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Unique email address (required).
 *                   example: john.doe@example.com
 *                 password:
 *                   type: string
 *                   description: Password (8-10 characters, required).
 *                   minLength: 8
 *                   maxLength: 10
 *                   example: password123
 *                 role:
 *                   type: string
 *                   description: User role.
 *                   enum:
 *                     - user
 *                     - admin
 *                   default: user
 *                   example: user
 *                 profilePicture:
 *                   type: string
 *                   description: URL to user's profile picture.
 *                   example: https://example.com
 *                 emailConfirmed:
 *                   type: boolean
 *                   description: Email confirmation status (required).
 *                   default: false
 *                   example: false
 *                 phoneNumber:
 *                   type: string
 *                   description: Unique phone number.
 *                   example: "+1-555-555-5555"
 *       responses:
 *         '201':
 *           description: User successfully registered
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: signup successfully.
 *         '400':
 *           description: Bad request (e.g., validation errors)
 *         '409':
 *           description: Conflict (e.g., username/email/phone number already exists)
 */
authRouter.post("/signup", signupValidator, validate, signupController);

/**
 * @swagger
 * /auth/verify/{verifyToken}:
 *   get:
 *     summary: Verify email address
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: verifyToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user email
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: "email verified successfully, check your email"
 */
authRouter.get("/verify/:token", emailTokenVerifyController);

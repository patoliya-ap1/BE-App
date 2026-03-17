import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 to 10 character long"),
];

export const signupValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 10 })
    .withMessage("Username must be between 5 to 10 character"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 10 })
    .withMessage("Password must be between 8 to 10 character long"),
  body("phoneNumber")
    .optional()
    .isMobilePhone("en-IN", { strictMode: true })
    .withMessage("Invalid Phone number"),
];

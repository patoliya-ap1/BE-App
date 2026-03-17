import rateLimit from "express-rate-limit";

export const rateLimitLogin = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 10,
  message: {
    success: false,
    message: "Too many request for login, please try later",
  },
});

export const rateLimitSignup = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 8,
  message: {
    success: false,
    message: "Too many request for signup, please try later",
  },
});

export const rateLimitPosts = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 1000,
  message: {
    success: false,
    message: "Too many request for signup, please try later",
  },
});

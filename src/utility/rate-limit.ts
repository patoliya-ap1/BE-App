import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 100,
  max: 100,
  message: { success: false, message: "Too many request, please try later" },
});

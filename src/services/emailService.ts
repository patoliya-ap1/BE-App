import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Email service not configured:", error);
  } else {
    console.log("Email service configured successfully");
  }
});

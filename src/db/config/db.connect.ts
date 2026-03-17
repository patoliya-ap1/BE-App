import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CONNECTION_URI = process.env.CONNECTION_URI;

export const initializeDatabase = async () => {
  try {
    const connected = await mongoose.connect(CONNECTION_URI || "");
    if (connected) {
      console.log("Database connected successfully.");
    }
  } catch (error) {
    console.log("Failed to connect with database", error);
  }
};

import dotenv from "dotenv";
import { Queue, Worker } from "bullmq";
dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

const connection = {
  url: REDIS_URL || "redis://localhost:6379",
};

export { connection, Queue, Worker };

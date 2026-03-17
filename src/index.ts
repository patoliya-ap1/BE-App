import express from "express";
import { initializeDatabase } from "./db/connect/db.connect.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { mainRouter } from "./routes/index-route.js";
import { logger } from "./utility/logger.js";
import helmet from "helmet";
import { limiter } from "./utility/rate-limit.js";
import { updatePostLikesCount } from "./utility/updatePostLikesCount.js";
import cron from "node-cron";
import { eventEmitter } from "./services/eventEmitter.js";
import { welcomeEmailJob } from "./utility/welcomeEmailJob.js";
import { initializeRedisCache } from "./services/redis.connect.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initializeDatabase();
initializeRedisCache()
const Port = process.env.PORT || 7000;
const app = express();
app.use(express.json());

//  HTTP security headers
app.use(helmet());

// limiter
app.use(limiter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to mongodb crud server" });
});

// get uploaded image from server

app.use(express.static("public"));
app.use(
  "/images",
  express.static(
    path.join(__dirname, "controller", "assets", "compressedImages"),
  ),
);

app.use("/", mainRouter);

// error middleware

app.use(errorMiddleware);

// handle invalid routes

app.all("/*fallback", (req, res) => {
  res.status(404).json({ success: false, message: "api route not found" });
});

// welcome email event emitter

eventEmitter.on("user.signup", welcomeEmailJob);

// update like count

cron.schedule("0 */12 * * *", () => {
  console.log("update like every 12 hour");
  updatePostLikesCount();
});

logger.info("server is running");

app.listen(Port, () => {
  console.log(`Server is running on Port ${Port}`);
});

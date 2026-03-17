import redis from "redis";
import { initializeSubscriber } from "./redisSubscriber.js";

const REDIS_URL = process.env.REDIS_URL;

export const publisher = redis.createClient({
  url: REDIS_URL || "redis://localhost:6379",
});

initializeSubscriber();

publisher.connect().then(() => {
  console.log("Publisher connected to redis");
});

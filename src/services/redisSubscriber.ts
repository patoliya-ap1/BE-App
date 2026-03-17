import redis from "redis";
import { eventEmitter } from "./eventEmitter.js";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const initializeSubscriber = async () => {
  const subscriber = redis.createClient({
    url: REDIS_URL,
  });

  await subscriber.connect();
  console.log("Subscriber connected to redis");

  await subscriber.subscribe("welcome-email", (eventData, channel) => {
    const data = JSON.parse(eventData);
    console.log(`Event ${data.event} emit for channel ${channel}`);
    eventEmitter.emit(data.event, data.payload);
  });
};

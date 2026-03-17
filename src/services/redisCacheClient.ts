import redis, { createClient } from "redis";
export let redisCacheClient: ReturnType<typeof createClient>;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
export const initializeRedisCache = async () => {
  redisCacheClient = redis.createClient({ url: REDIS_URL });
  await redisCacheClient.connect();
  console.log("initialize redis cache client");
};

import redis, { createClient } from "redis";
export let redisCacheClient: ReturnType<typeof createClient>;
export const initializeRedisCache = async () => {
  redisCacheClient = redis.createClient();
  await redisCacheClient.connect();
  console.log("initialize redis cache client");
};

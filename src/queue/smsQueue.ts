import { Queue, connection } from "../services/bullmqConfig.js";

export const smsQueue = new Queue("smsQueue", { connection });

import { Queue, connection } from "../services/bullmqConfig.js";
// welcome email que
export const emailQueue = new Queue("emailQueue", { connection });

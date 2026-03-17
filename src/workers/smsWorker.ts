import { Worker, connection } from "../services/bullmqConfig.js";
import { smsClient } from "../services/smsService.js";
import type { SmsData } from "../utility/Type.js";

const sendSms = async (smsData: SmsData) => {
  await smsClient.messages.create({
    body: smsData.body,
    to: smsData.to,
    from: smsData.from,
  });
};

const worker = new Worker(
  "smsQueue",
  async (job) => {
    const { body, to, from } = job.data;
    await sendSms({ body, to, from });
    return "SMS processes successfully";
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job SMS${job.id} completed!`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed with error: ${error.message}`);
});

console.log("Welcome SMS worker started. listening for jobs.");

import { emailQueue } from "../queue/emailQueue.js";

export const welcomeEmailJob = async (jobData: {
  email: string;
  subject: string;
  template: string;
}) => {
  try {
    await emailQueue.add(
      "sendWelcomeEmail",
      {
        email: jobData.email,
        subject: jobData.subject,
        template: jobData.template,
      },
      { attempts: 2 },
    );
    console.log("Welcome email job added to queue");
  } catch (error) {
    console.log("Failed to add Welcome email job to queue", error);
  }
};

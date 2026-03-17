import { updatePostLikesCount } from "./updatePostLikesCount.js";
import cron from "node-cron";

export function scheduleUpdateLikeCount() {
  cron.schedule("0 */12 * * *", () => {
    console.log("update like every 12 hour");
    updatePostLikesCount();
  });
}

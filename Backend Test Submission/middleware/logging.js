import { Log } from "../../Logging Middleware/middleware/logger.js";

export async function logEvent(stack, level, pkg, message) {
  await Log(stack, level, pkg, message);
}
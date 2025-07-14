// Logging Middleware/middleware/logger.js
import { getAuthToken } from "../utils/auth.js";

export async function Log(stack, level, pkg, message) {
  const validStacks = ["backend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validBackendPackages = [
    "cache",
    "controller",
    "cron_job",
    "db",
    "domain",
    "handler",
    "repository",
    "route",
    "service",
    "auth",
    "config",
    "middleware",
    "utils",
  ];

  if (!validStacks.includes(stack)) throw new Error("Invalid stack");
  if (!validLevels.includes(level)) throw new Error("Invalid level");

  const isValidPkg = validBackendPackages.includes(pkg);

  if (!isValidPkg) throw new Error("Invalid package for given stack");

  const token = await getAuthToken();

  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Log failed:", errData.message || res.statusText);
      throw new Error("Log API call failed");
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Log error:", err.message);
    throw err;
  }
}

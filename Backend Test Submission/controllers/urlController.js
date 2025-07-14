import Url from "../models/urlModel.js";
import { generateShortcode } from "../utils/generateShortCode.js";
import { logEvent } from "../middleware/logging.js";

export async function createShortUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !/^https?:\/\/.+/.test(url)) {
    await logEvent("backend", "error", "handler", "Invalid URL format");
    return res.status(400).json({ error: "Invalid URL format" });
  }

  let finalShortcode = shortcode || generateShortcode();

  const existing = await Url.findOne({ shortcode: finalShortcode });
  if (existing) {
    await logEvent("backend", "error", "handler", "Shortcode already in use");
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const expiry = new Date(Date.now() + validity * 60000);

  const shortUrl = await Url.create({
    originalUrl: url,
    shortcode: finalShortcode,
    expiry,
  });

  await logEvent("backend", "info", "controller", "Short URL created");

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get("host")}/${finalShortcode}`,
    expiry: expiry.toISOString(),
  });
}

export async function getShortUrlStats(req, res) {
  const { shortcode } = req.params;
  const entry = await Url.findOne({ shortcode });

  if (!entry) {
    await logEvent("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    totalClicks: entry.clicks.length,
    clickDetails: entry.clicks,
  });
}

export async function handleRedirect(req, res) {
  const { shortcode } = req.params;
  const entry = await Url.findOne({ shortcode });

  if (!entry) {
    await logEvent("backend", "error", "handler", "Shortcode not found");
    return res.status(404).send("Shortcode not found");
  }

  if (new Date() > entry.expiry) {
    await logEvent("backend", "warn", "handler", "Shortcode expired");
    return res.status(410).send("This link has expired");
  }

  entry.clicks.push({
    timestamp: new Date(),
    referrer: req.get("referrer") || "direct",
    ip: req.ip,
  });

  await entry.save();

  await logEvent(
    "backend",
    "info",
    "route",
    `Redirecting to ${entry.originalUrl}`
  );

  res.redirect(entry.originalUrl);
}

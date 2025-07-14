import express from "express";
import {
  createShortUrl,
  getShortUrlStats,
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/", createShortUrl);
router.get("/:shortcode", getShortUrlStats);

export default router;

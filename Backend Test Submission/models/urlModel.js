import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  ip: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [clickSchema],
});

export default mongoose.model("Url", urlSchema);

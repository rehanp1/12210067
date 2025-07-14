import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import { handleRedirect } from "./controllers/urlController.js";

const app = express();
dotenv.config();

app.use(express.json());

app.use("/shorturls", urlRoutes);

app.get("/:shortcode", handleRedirect);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

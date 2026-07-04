import express from "express";
import { getActivityFeed } from "../controllers/feed.controller.js";
import { protect } from "../middelware/auth.middleware.js";
const router = express.Router();
router.get("/", protect, getActivityFeed);
export default router;
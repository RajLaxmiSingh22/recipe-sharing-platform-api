import express from "express";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/follow.controller.js";
import { protect } from "../middelware/auth.middleware.js";
const router = express.Router();

router.post("/:userId", protect, followUser);
router.delete("/:userId", protect, unfollowUser);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);

export default router;
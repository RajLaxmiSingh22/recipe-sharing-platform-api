import express from "express";
import { getMe, updateMe, getMyRecipes, getAllUsers, banUser, unbanUser } from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middelware/auth.middleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/me/recipes", protect, getMyRecipes);
router.get("/me/favorites", protect, async (req, res) => {
  const recipes = await req.user.getFavoriteRecipes();
  res.status(200).json(recipes);
});

// Admin only
router.get("/", protect, isAdmin, getAllUsers);
router.put("/:id/ban", protect, isAdmin, banUser);
router.put("/:id/unban", protect, isAdmin, unbanUser);

export default router;
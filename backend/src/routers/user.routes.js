import express from "express";
import { getMe, updateMe, getMyRecipes, banUser } from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middelware/auth.middleware.js";
const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/me/recipes", protect, getMyRecipes);
router.get("/me/favorites", protect, (req, res, next) => { req.params.recipeId = null; next(); }, async (req, res) => {
  const recipes = await req.user.getFavoriteRecipes();
  res.status(200).json(recipes);
});
router.put("/:id/ban", protect, isAdmin, banUser);

export default router;
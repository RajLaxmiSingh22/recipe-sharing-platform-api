// recipe.routes.js
import express from "express";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "../controllers/recipe.controller.js";
import { protect } from "../middelware/auth.middleware.js";
import { upload } from "../middelware/upload.middleware.js";
const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, upload.single("coverImage"), createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;
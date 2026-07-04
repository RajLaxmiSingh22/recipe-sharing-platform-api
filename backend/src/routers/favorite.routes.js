
// favorite.routes.js
import express from "express";
import { toggleFavorite, getMyFavorites } from "../controllers/favorite.controller.js";
// import { protect } from "../middelware/authMiddleware.js";
import { protect } from "../middelware/auth.middleware.js";

const router = express.Router();
router.post("/:recipeId", protect, toggleFavorite);
router.get("/", protect, getMyFavorites);
export default router;
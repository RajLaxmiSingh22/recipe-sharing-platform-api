// review.routes.js
import express from "express";
import { addReview, getRecipeReviews, deleteReview } from "../controllers/review.controller.js";
// import { protect } from "../middelware/authMiddleware.js";
import { protect } from "../middelware/auth.middleware.js";


const router = express.Router();
router.get("/:recipeId", getRecipeReviews);
router.post("/:recipeId", protect, addReview);
router.delete("/:id", protect, deleteReview);
export default router;
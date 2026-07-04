// collection.routes.js
import express from "express";
import { createCollection, addRecipeToCollection, getMyCollections } from "../controllers/collection.controller.js";
// import { protect } from "../middelware/authMiddleware.js";
import { protect } from "../middelware/auth.middleware.js";

const router = express.Router();
router.post("/", protect, createCollection);
router.post("/:collectionId/recipes/:recipeId", protect, addRecipeToCollection);
router.get("/", protect, getMyCollections);
export default router;
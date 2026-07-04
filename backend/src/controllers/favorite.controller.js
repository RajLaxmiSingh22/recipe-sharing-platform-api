import { Favorite, Recipe } from "../models/index.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existing = await Favorite.findOne({ where: { userId: req.user.id, recipeId } });
    if (existing) {
      await existing.destroy();
      return res.status(200).json({ message: "Removed from favorites", favorited: false });
    }
    await Favorite.create({ userId: req.user.id, recipeId });
    res.status(201).json({ message: "Added to favorites", favorited: true });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const user = await req.user.getFavoriteRecipes(); // magic method from belongsToMany "as: favoriteRecipes"
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
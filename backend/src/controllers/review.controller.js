import { Review, Recipe, User } from "../models/index.js";

export const addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const existing = await Review.findOne({ where: { recipeId, userId: req.user.id } });
    if (existing) return res.status(409).json({ message: "You already reviewed this recipe" });

    const review = await Review.create({ recipeId, userId: req.user.id, rating, comment });

    // Recalculate avgRating + reviewsCount (denormalized fields on Recipe)
    const allReviews = await Review.findAll({ where: { recipeId } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await recipe.update({ avgRating: avg.toFixed(1), reviewsCount: allReviews.length });

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const getRecipeReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { recipeId: req.params.recipeId, isPublished: true },
      include: [{ model: User, as: "reviewer", attributes: ["id", "username", "profileImage"] }],
      order: [["created_at", "DESC"]], // use actual DB column name, not JS attribute name — safer with joins
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = review.userId === req.user.id;
    if (!isOwner && req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    await review.destroy();
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
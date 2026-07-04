import { Collection, Recipe } from "../models/index.js";

export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const collection = await Collection.create({ userId: req.user.id, name, description });
    res.status(201).json({ message: "Collection created", collection });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "You already have a collection with this name" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addRecipeToCollection = async (req, res) => {
  try {
    const { collectionId, recipeId } = req.params;
    const collection = await Collection.findByPk(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    if (collection.userId !== req.user.id) return res.status(403).json({ message: "Not your collection" });

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    await collection.addRecipe(recipe); // magic method from belongsToMany
    res.status(200).json({ message: "Recipe added to collection" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      include: [{ model: Recipe, as: "recipes" }],
    });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
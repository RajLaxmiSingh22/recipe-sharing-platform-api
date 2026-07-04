import { Recipe, Ingredient, Instruction, Category, User, RecipeImage, ActivityFeed } from "../models/index.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { Op } from "sequelize";
// import { ActivityFeed } from "../models/index.js"; // add to imports at top


export const createRecipe = async (req, res) => {
  try {
    const { title, description, prepTime, cookTime, servings, difficultyLevel, ingredients, instructions, categoryIds } = req.body;

    let coverImage = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "recipes/covers");
      coverImage = result.secure_url;
    }

    const recipe = await Recipe.create({
      userId: req.user.id,
      title, description, prepTime, cookTime, servings, difficultyLevel, coverImage,
    });

// after recipe is created:
await ActivityFeed.create({ userId: req.user.id, actionType: "recipe_created", recipeId: recipe.id });
    if (ingredients?.length) {
      const rows = JSON.parse(ingredients).map((i) => ({ ...i, recipeId: recipe.id }));
      await Ingredient.bulkCreate(rows);
    }
    if (instructions?.length) {
      const rows = JSON.parse(instructions).map((i) => ({ ...i, recipeId: recipe.id }));
      await Instruction.bulkCreate(rows);
    }
    if (categoryIds?.length) {
      await recipe.setCategories(JSON.parse(categoryIds)); // Sequelize magic method from belongsToMany
    }

    res.status(201).json({ message: "Recipe created", recipe });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const { search, category, difficulty, page = 1, limit = 10 } = req.query;
    const where = { isPublished: true };
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (difficulty) where.difficultyLevel = difficulty;

    const recipes = await Recipe.findAndCountAll({
      where,
      include: [
        { model: User, as: "author", attributes: ["id", "username", "profileImage"] },
        { model: Category, as: "categories", ...(category ? { where: { name: category } } : {}) },
      ],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    res.status(200).json({
      total: recipes.count,
      page: Number(page),
      totalPages: Math.ceil(recipes.count / limit),
      recipes: recipes.rows,
    });
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      where: { id: req.params.id, isPublished: true },
      include: [
        { model: User, as: "author", attributes: ["id", "username", "profileImage"] },
        { model: Ingredient, as: "ingredients" },
        { model: Instruction, as: "instructions" },
        { model: Category, as: "categories" },
      ],
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    await recipe.increment("viewsCount"); // atomic increment, no race condition
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.userId !== req.user.id) return res.status(403).json({ message: "Not your recipe" });

    await recipe.update(req.body);
    res.status(200).json({ message: "Recipe updated", recipe });
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const isOwner = recipe.userId === req.user.id;
    const isAdminUser = req.user.role === "admin";
    if (!isOwner && !isAdminUser) return res.status(403).json({ message: "Not authorized" });

    await recipe.destroy(); // paranoid: true means this soft-deletes, sets deleted_at
    res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
import sequelize  from "../config/database.js";
import User from "./user.model.js";
import Recipe from "./recipe.model.js";
import Category from "./category.model.js";
import Ingredient from "./ingredient.model.js";
import Instruction from "./instruction.model.js";
import Review from "./review.model.js";
import Favorite from "./favorite.model.js";
import Collection from "./collection.model.js";
import CollectionRecipe from "./collectionRecipe.model.js";
import Follow from "./follow.model.js";
import RecipeCategory from "./recipeCategory.model.js";
import RecipeImage from "./recipeImage.model.js";
import ActivityFeed from "./activityFeed.model.js";

// ================================================================
// 1. USER <-> RECIPE (one-to-many)
// A user writes many recipes. recipes.user_id is the foreign key.
// ================================================================
User.hasMany(Recipe, { foreignKey: "userId", as: "recipes" });
Recipe.belongsTo(User, { foreignKey: "userId", as: "author" });
// why "author" not "user"? because later Recipe will ALSO relate to User
// via Favorites — different relationship, needs a different name.

// ================================================================
// 2. RECIPE <-> INGREDIENT (one-to-many)
// ================================================================
Recipe.hasMany(Ingredient, { foreignKey: "recipeId", as: "ingredients" });
Ingredient.belongsTo(Recipe, { foreignKey: "recipeId" });

// ================================================================
// 3. RECIPE <-> INSTRUCTION (one-to-many)
// ================================================================
Recipe.hasMany(Instruction, { foreignKey: "recipeId", as: "instructions" });
Instruction.belongsTo(Recipe, { foreignKey: "recipeId" });

// ================================================================
// 4. RECIPE <-> REVIEW (one-to-many) + REVIEW <-> USER
// A review belongs to BOTH a recipe and the user who wrote it.
// ================================================================
Recipe.hasMany(Review, { foreignKey: "recipeId", as: "reviews" });
Review.belongsTo(Recipe, { foreignKey: "recipeId" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "reviewer" });

// ================================================================
// 5. RECIPE <-> CATEGORY (many-to-many, through RecipeCategory)
// One recipe can have many tags (veg + dessert). One category has many recipes.
// through: tells Sequelize which join table row-creation happens in.
// ================================================================
Recipe.belongsToMany(Category, {
  through: RecipeCategory,
  foreignKey: "recipeId",
  otherKey: "categoryId",
  as: "categories",
});
Category.belongsToMany(Recipe, {
  through: RecipeCategory,
  foreignKey: "categoryId",
  otherKey: "recipeId",
  as: "recipes",
});

// ================================================================
// 6. USER <-> RECIPE as FAVORITES (many-to-many, through Favorite)
// Note: this is a SECOND relationship between User and Recipe
// (first was "author" in #1) — that's exactly why aliases matter.
// ================================================================
User.belongsToMany(Recipe, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "recipeId",
  as: "favoriteRecipes",
});
Recipe.belongsToMany(User, {
  through: Favorite,
  foreignKey: "recipeId",
  otherKey: "userId",
  as: "favoritedBy",
});

// ================================================================
// 7. USER <-> COLLECTION (one-to-many)
// ================================================================
User.hasMany(Collection, { foreignKey: "userId", as: "collections" });
Collection.belongsTo(User, { foreignKey: "userId" });

// ================================================================
// 8. COLLECTION <-> RECIPE (many-to-many, through CollectionRecipe)
// ================================================================
Collection.belongsToMany(Recipe, {
  through: CollectionRecipe,
  foreignKey: "collectionId",
  otherKey: "recipeId",
  as: "recipes",
});
Recipe.belongsToMany(Collection, {
  through: CollectionRecipe,
  foreignKey: "recipeId",
  otherKey: "collectionId",
  as: "collections",
});

// ================================================================
// 9. USER <-> USER as FOLLOWS (self-referencing many-to-many)
// The trickiest one: User relates to itself, so foreignKey vs otherKey
// determines the DIRECTION of the relationship.
// ================================================================
User.belongsToMany(User, {
  through: Follow,
  foreignKey: "followerId",   // "I am the follower"
  otherKey: "followingId",    // "...following these people"
  as: "following",
});
User.belongsToMany(User, {
  through: Follow,
  foreignKey: "followingId",  // "I am being followed"
  otherKey: "followerId",     // "...by these people"
  as: "followers",
});

// ================================================================
// BONUS: RecipeImage + ActivityFeed (simple one-to-many, same pattern as #2/#3)
// ================================================================
Recipe.hasMany(RecipeImage, { foreignKey: "recipeId", as: "images" });
RecipeImage.belongsTo(Recipe, { foreignKey: "recipeId" });

User.hasMany(ActivityFeed, { foreignKey: "userId", as: "activities" });
ActivityFeed.belongsTo(User, { foreignKey: "userId" });
ActivityFeed.belongsTo(Recipe, { foreignKey: "recipeId" });
ActivityFeed.belongsTo(Review, { foreignKey: "reviewId" });


export {
  sequelize,
  User,
  Recipe,
  Category,
  Ingredient,
  Instruction,
  Review,
  Favorite,
  Collection,
  CollectionRecipe,
  Follow,
  RecipeCategory,
  RecipeImage,
  ActivityFeed,
};
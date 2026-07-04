import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const RecipeCategory = sequelize.define(
  "RecipeCategory",
  {
    recipeId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "recipe_id" },
    categoryId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "category_id" },
  },
  { tableName: "recipe_categories", underscored: true, timestamps: false }
);
export default RecipeCategory;
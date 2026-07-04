import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const RecipeImage = sequelize.define(
  "RecipeImage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, field: "recipe_id" },
    imageUrl: { type: DataTypes.STRING(500), allowNull: false, field: "image_url" },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: "sort_order" },
  },
  { tableName: "recipe_images", underscored: true, timestamps: true, updatedAt: false, createdAt: "created_at" }
);
export default RecipeImage;
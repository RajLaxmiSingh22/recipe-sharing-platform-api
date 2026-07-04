import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CollectionRecipe = sequelize.define(
  "CollectionRecipe",
  {
    collectionId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "collection_id" },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "recipe_id" },
  },
  { tableName: "collection_recipes", underscored: true, timestamps: false }
);
export default CollectionRecipe;
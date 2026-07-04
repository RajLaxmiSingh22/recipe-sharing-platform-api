import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "user_id" },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "recipe_id" },
  },
  { tableName: "favorites", underscored: true, timestamps: true, updatedAt: false, createdAt: "created_at" }
);
export default Favorite;
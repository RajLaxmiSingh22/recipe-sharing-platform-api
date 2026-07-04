import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, field: "recipe_id" },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }, // mirrors your SQL CHECK constraint at app level
    },
    comment: DataTypes.TEXT,
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_published" },
  },
  { tableName: "reviews", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: "created_at" }
);
export default Review;
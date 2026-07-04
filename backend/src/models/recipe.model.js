import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Recipe = sequelize.define(
  "Recipe",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING(500),
      field: "cover_image",
    },
    prepTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "prep_time",
    },
    cookTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cook_time",
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficultyLevel: {
      type: DataTypes.STRING(20),
      defaultValue: "Medium",
      field: "difficulty_level",
    },
    avgRating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
      field: "avg_rating",
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "reviews_count",
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_published",
    },
    viewsCount: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
  field: "views_count",
},
  },
  {
    tableName: "recipes",
    underscored: true,
    paranoid: true, // same soft-delete pattern — admin "deletes" a post, data stays
    timestamps: true,
  }
);

export default Recipe;
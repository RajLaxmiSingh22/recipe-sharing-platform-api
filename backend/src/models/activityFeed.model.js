import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const ActivityFeed = sequelize.define(
  "ActivityFeed",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    actionType: { type: DataTypes.STRING(50), allowNull: false, field: "action_type" },
    recipeId: { type: DataTypes.INTEGER, field: "recipe_id" },
    reviewId: { type: DataTypes.INTEGER, field: "review_id" },
  },
  { tableName: "activity_feed", underscored: true, timestamps: true, updatedAt: false, createdAt: "created_at" }
);
export default ActivityFeed;
import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const Follow = sequelize.define(
  "Follow",
  {
    followerId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "follower_id" },
    followingId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: "following_id" },
  },
  { tableName: "follows", underscored: true, timestamps: true, updatedAt: false, createdAt: "created_at" }
);
export default Follow;
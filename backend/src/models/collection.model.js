import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const Collection = sequelize.define(
  "Collection",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: DataTypes.TEXT,
    coverImage: { type: DataTypes.STRING(500), field: "cover_image" },
  },
  { tableName: "collections", underscored: true, timestamps: true, updatedAt: "updated_at", createdAt: "created_at" }
);
export default Collection;
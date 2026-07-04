import { DataTypes } from "sequelize";
import sequelize  from "../config/database.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, field: "recipe_id" },
    name: { type: DataTypes.STRING(150), allowNull: false },
    quantity: { type: DataTypes.STRING(50), allowNull: false },
    unit: DataTypes.STRING(50),
  },
  { tableName: "ingredients", underscored: true, timestamps: false }
);
// timestamps: false because your schema only has created_at, no updated_at
export default Ingredient;
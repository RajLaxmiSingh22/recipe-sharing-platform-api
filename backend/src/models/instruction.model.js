import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Instruction = sequelize.define(
  "Instruction",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false, field: "recipe_id" },
    stepNumber: { type: DataTypes.INTEGER, allowNull: false, field: "step_number" },
    description: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "instructions", underscored: true, timestamps: false }
);
export default Instruction;
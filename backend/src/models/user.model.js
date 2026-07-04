import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";



const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }, // Sequelize-level validation, extra safety net
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash", // maps camelCase JS -> snake_case DB column
    },
    bio: DataTypes.TEXT,
    profileImage: {
      type: DataTypes.STRING(500),
      field: "profile_image",
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_banned",
    },
    role: {
  type: DataTypes.STRING(20),
  defaultValue: "user",
},
  },
  {
    tableName: "users",
    underscored: true, // auto maps createdAt -> created_at
    paranoid: true,    // enables soft-delete using deleted_at automatically!
    timestamps: true,
  }
);

export default User;
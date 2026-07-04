import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const { password: _removed, ...safeUser } = user.toJSON();

  return { user: safeUser, token };
};

export const loginUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    throw new AppError("Invalid email or password", 401);
  }

  if (existingUser.is_banned) {
    throw new AppError("Your account has been banned", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: existingUser.id, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const { password: _removed, ...safeUser } = existingUser.toJSON();
  return { user: safeUser, token };
};


// banned user

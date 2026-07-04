import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required" });
    }

    // const existing = await User.findOne({ where: { email } });
    // if (existing) return res.status(409).json({ message: "Email already registered" });
const existingEmail = await User.findOne({ where: { email } });
if (existingEmail) return res.status(409).json({ message: "Email already registered" });

const existingUsername = await User.findOne({ where: { username } });
if (existingUsername) return res.status(409).json({ message: "Username already taken" });
    const passwordHash = await bcrypt.hash(password, 10); // 10 salt rounds — industry standard

    const user = await User.create({ username, email, passwordHash, bio });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, username: user.username, email: user.email }, // passwordHash never leaves the server
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" }); // don't say "email not found" — leaks which emails exist

    if (user.isBanned) return res.status(403).json({ message: "Account has been banned" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
// import { User, Recipe, Favorite } from "../models/index.js";

// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       attributes: ["id", "username", "email", "bio", "profileImage", "role"],
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Get me error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const updateMe = async (req, res) => {
//   try {
//     const { bio, profileImage } = req.body;
//     await req.user.update({ bio, profileImage });
//     res.status(200).json({ message: "Profile updated", user: req.user });
//   } catch (error) {
//     console.error("Update me error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const getMyRecipes = async (req, res) => {
//   try {
//     const recipes = await Recipe.findAll({ where: { userId: req.user.id } });
//     res.status(200).json(recipes);
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// // Admin only
// // export const banUser = async (req, res) => {
// //   try {
// //     const user = await User.findByPk(req.params.id);
// //     if (!user) return res.status(404).json({ message: "User not found" });
// //     await user.update({ isBanned: true });
// //     res.status(200).json({ message: "User banned" });
// //   } catch (error) {
// //     console.error("Ban user error:", error);
// //     res.status(500).json({ message: "Something went wrong" });
// //   }
// // };
// export const banUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const isNumeric = /^\d+$/.test(id); // check if input is purely digits

//     const user = isNumeric
//       ? await User.findByPk(id)
//       : await User.findOne({ where: { username: id } });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     await user.update({ isBanned: true });
//     res.status(200).json({ message: "User banned" });
//   } catch (error) {
//     console.error("Ban user error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };







import { User, Recipe, Favorite } from "../models/index.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "bio", "profileImage", "role"],
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { bio, profileImage } = req.body;
    await req.user.update({ bio, profileImage });
    res.status(200).json({ message: "Profile updated", user: req.user });
  } catch (error) {
    console.error("Update me error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ where: { userId: req.user.id } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "isBanned", "role"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const user = isNumeric
      ? await User.findByPk(id)
      : await User.findOne({ where: { username: id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update({ isBanned: true });
    res.status(200).json({ message: "User banned" });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const user = isNumeric
      ? await User.findByPk(id)
      : await User.findOne({ where: { username: id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update({ isBanned: false });
    res.status(200).json({ message: "User unbanned" });
  } catch (error) {
    console.error("Unban user error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
import { User, Follow } from "../models/index.js";

// export const followUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     if (Number(userId) === req.user.id) {
//       return res.status(400).json({ message: "You cannot follow yourself" });
//     }
//     const targetUser = await User.findByPk(userId);
//     if (!targetUser) return res.status(404).json({ message: "User not found" });

//     const existing = await Follow.findOne({ where: { followerId: req.user.id, followingId: userId } });
//     if (existing) return res.status(409).json({ message: "Already following this user" });

//     await Follow.create({ followerId: req.user.id, followingId: userId });
//     res.status(201).json({ message: "Followed successfully" });
//   } catch (error) {
//     console.error("Follow error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };



export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const isNumeric = /^\d+$/.test(userId);

    const targetUser = isNumeric
      ? await User.findByPk(userId)
      : await User.findOne({ where: { username: userId } });

    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (targetUser.id === req.user.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existing = await Follow.findOne({ where: { followerId: req.user.id, followingId: targetUser.id } });
    if (existing) return res.status(409).json({ message: "Already following this user" });

    await Follow.create({ followerId: req.user.id, followingId: targetUser.id });
    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const isNumeric = /^\d+$/.test(userId);
    const targetUser = isNumeric
      ? await User.findByPk(userId)
      : await User.findOne({ where: { username: userId } });

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const existing = await Follow.findOne({ where: { followerId: req.user.id, followingId: targetUser.id } });
    if (!existing) return res.status(404).json({ message: "You are not following this user" });

    await existing.destroy();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// export const unfollowUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const existing = await Follow.findOne({ where: { followerId: req.user.id, followingId: userId } });
//     if (!existing) return res.status(404).json({ message: "You are not following this user" });

//     await existing.destroy();
//     res.status(200).json({ message: "Unfollowed successfully" });
//   } catch (error) {
//     console.error("Unfollow error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const followers = await user.getFollowers({ attributes: ["id", "username", "profileImage"] });
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const following = await user.getFollowing({ attributes: ["id", "username", "profileImage"] });
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
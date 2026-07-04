import { ActivityFeed, User, Recipe, Review } from "../models/index.js";

export const getActivityFeed = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const following = await user.getFollowing({ attributes: ["id"] });
    const followingIds = following.map((u) => u.id);

    if (followingIds.length === 0) {
      return res.status(200).json({ message: "Follow some users to see their activity here", feed: [] });
    }

    const feed = await ActivityFeed.findAll({
      where: { userId: followingIds },
      include: [
        { model: User, attributes: ["id", "username", "profileImage"] },
        { model: Recipe, attributes: ["id", "title", "coverImage"] },
        { model: Review, attributes: ["id", "rating", "comment"] },
      ],
      order: [["created_at", "DESC"]], // remember: real column name, not JS attribute — you learned this bug already
      limit: 20,
    });

    res.status(200).json(feed);
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
import Badge from "../models/badgeModel.js";
import User from "../models/userModel.js";

export const checkBadgeEligibility = async (userId) => {
  const user = await User.findById(userId);
  const allBadges = await Badge.find({});
  const earnedBadges = [];

  for (const badge of allBadges) {
    if (user.badges.includes(badge._id)) {
      continue;
    }

    let eligible = false;

    switch (badge.category) {
      case "points":
        if (user.bayanihanPoints >= badge.bayanihanPointsRequired) {
          eligible = true;
        }
        break;
      case "level":
        if (user.level >= badge.bayanihanPointsRequired) {
          eligible = true;
        }
        break;
      case "first_activity":
        const ProofOfWork = (await import("../models/proofOfWorkModel.js")).default;
        const powCount = await ProofOfWork.countDocuments({ userId });
        if (powCount >= 1) {
          eligible = true;
        }
        break;
      default:
        break;
    }

    if (eligible) {
      user.badges.push(badge._id);
      earnedBadges.push(badge);
    }
  }

  if (earnedBadges.length > 0) {
    await user.save();
  }

  return earnedBadges;
};

export const calculateLevel = (bayanihanPoints) => {
  return Math.floor(bayanihanPoints / 1000) + 1;
};


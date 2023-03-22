const express = require("express");
const { requireAuth, isAuthorized } = require("../../utils/auth");
const {
  User,
  Spot,
  Review,
  ReviewImage,
  SpotImage,
  sequelize,
} = require("../../db/models");

const router = express.Router();

// Get all reviews for current user
router.get("/current", requireAuth, async (req, res, next) => {
  // Get user
  const userId = req.user.id;
  const user = await User.findByPk(userId, {
    attributes: ["id", "firstName", "lastName"],
  });

  //Get reviews
  const reviews = await Review.findAll({
    where: { userId },
    raw: true,
  });

  // Append spot and review images to each review
  for (const review of reviews) {
    // Get spot
    const spot = await Spot.findByPk(review.spotId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });
    // Get previewImage for spot
    const previewImage = await SpotImage.findOne({
      where: { preview: true, spotId: spot.id },
    });
    spot.previewImage = previewImage.url;

    // Get reviewImages
    const reviewImages = await ReviewImage.findAll({
      where: { reviewId: review.id },
      attributes: ["id", "url"],
    });

    // Add them to review and send
    review.User = user;
    review.Spot = spot;
    review.ReviewImages = reviewImages;
  }

  res.json({ Reviews: reviews });
});

module.exports = router;

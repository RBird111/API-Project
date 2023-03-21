const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, sequelize } = require("../../db/models");

const router = express.Router();

// Get all spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({ raw: true });

  for (let spot of spots) {
    const spotReviews = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
      where: {
        spotId: spot.id,
      },
      raw: true,
    });

    const spotImg = await SpotImage.findOne({
      where: { preview: true, spotId: spot.id },
    });

    spot.avgRating = spotReviews.avgRating;
    spot.previewImage = spotImg.url;
  }

  res.json({ Spots: spots });
});

// Get current user'a spots
router.get("/current", requireAuth, async (req, res, next) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.fn("MAX", sequelize.col("SpotImages.url")), "previewImage"],
      ],
    },
    where: {
      ownerId: req.user.id,
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: [],
        where: {
          preview: true,
        },
      },
    ],
    group: [["Spot.id"]],
  });

  res.json({ Spots: spots });
});

// Get Spot details by ID
router.get("/:spotId", async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    const spotReviews = await Review.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("stars")), "numReviews"],
        [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
      ],
      where: {
        spotId: req.params.spotId,
      },
      raw: true,
    });

    const spotImages = await SpotImage.findAll({
      attributes: {
        exclude: ["spotId"],
      },
      where: { spotId: req.params.spotId },
    });

    const owner = await User.findOne({ where: { id: spot.ownerId } });

    res.json({
      ...spot.toJSON(),
      ...spotReviews,
      SpotImages: spotImages,
      Owner: owner,
    });
  } catch (err) {
    res.status(404);
    res.json({ message: "Spot couldn't be found" });
  }
});

module.exports = router;

const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, sequelize } = require("../../db/models");

const router = express.Router();

// Get all spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("SpotImages.url"), "previewImage"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: [],
      },
    ],
    group: [["Spot.id"]],
  });

  res.json({ Spots: spots });
});

// Get current user'a spots
router.get("/current", requireAuth, async (req, res, next) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        [sequelize.col("SpotImages.url"), "previewImage"],
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
      },
    ],
  });

  res.json({ Spots: spots });
});

module.exports = router;

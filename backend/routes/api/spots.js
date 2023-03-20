const express = require("express");
const { Spot, SpotImage, Review, sequelize } = require("../../db/models");

const router = express.Router();

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

module.exports = router;

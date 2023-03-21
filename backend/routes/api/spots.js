const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { User, Spot, SpotImage, Review, sequelize } = require("../../db/models");

const router = express.Router();

// Get all spots
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({ raw: true });

  for (let spot of spots) {
    // Get Reviews for each Spot
    const spotReviews = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]],
      where: {
        spotId: spot.id,
      },
      raw: true,
    });

    // Get preview image for each spot
    const spotImg = await SpotImage.findOne({
      where: { preview: true, spotId: spot.id },
    });

    // Add appropriate keys to each spot
    spot.avgRating = spotReviews.avgRating;
    spot.previewImage = spotImg.url;
  }

  res.json({ Spots: spots });
});

// Get current user's spots
router.get("/current", requireAuth, async (req, res, next) => {
  // Get Spot
  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id,
    },
    raw: true,
  });

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
    spot.previewImage = spotImg ? spotImg.url : null;
  }

  res.json({
    Spots: spots,
  });
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

const validateCreateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),

  check("city").exists({ checkFalsy: true }).withMessage("City is required"),

  check("state").exists({ checkFalsy: true }).withMessage("State is required"),

  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),

  check("lat")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Latitude is not valid"),

  check("lng")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Longitude is not valid"),

  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),

  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),

  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),

  handleValidationErrors,

  requireAuth,
];

// Create a spot
router.post("/", validateCreateSpot, async (req, res, next) => {
  const ownerId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201);
  res.json(spot);
});

module.exports = router;

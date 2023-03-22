const express = require("express");
const { requireAuth, isAuthorized } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  sequelize,
} = require("../../db/models");

const spotNotFound = (next) => {
  const err = new Error("Spot couldn't be found");
  err.title = "Spot couldn't be found";
  err.errors = { message: "Spot couldn't be found" };
  err.status = 404;
  return next(err);
};

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
    spot.previewImage = spotImg ? spotImg.url : null;
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

// Get reviews by spot ID
router.get("/:spotId/reviews", async (req, res, next) => {
  // Check that spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

  // Get reviews
  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    raw: true,
  });

  // Append user and images to reviews
  for (const review of reviews) {
    // Get user
    const user = await User.findByPk(review.userId, {
      attributes: { exclude: ["username"] },
      where: { id: review.userId },
    });

    // Get review images
    const reviewImages = await ReviewImage.findAll({
      where: { reviewId: review.id },
      attributes: ["id", "url"],
    });

    // Append both to review
    review.User = user;
    review.ReviewImages = reviewImages;
  }

  res.json({ Reviews: reviews });
});

// Get spot details by ID
router.get("/:spotId", async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

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
});

// Validation for post/put routes
const validateSpot = [
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
router.post("/", validateSpot, async (req, res, next) => {
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

// Add image to a spot based on the spot's ID
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

  // Check if authorized
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Add image
  const { url, preview } = req.body;

  const spotImage = await SpotImage.create({
    spotId: req.params.spotId,
    url,
    preview,
  });

  res.json({
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview,
  });
});

// Validate review body
const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),

  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),

  handleValidationErrors,

  requireAuth,
];

// Create a review for spot
router.post("/:spotId/reviews", validateReview, async (req, res, next) => {
  // Check that spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

  // Check if user has already reviewed spot
  const userReviews = await spot.getReviews({
    where: { userId: req.user.id },
  });
  if (userReviews.length !== 0) {
    const err = new Error("User already has a review for this spot");
    err.title = "User already has a review for this spot";
    err.errors = { message: "User already has a review for this spot" };
    err.status = 403;

    return next(err);
  }

  const { review, stars } = req.body;

  const newReview = await Review.create({
    userId: req.user.id,
    spotId: req.params.spotId,
    review,
    stars,
  });

  res.json(newReview);
});

// Edit a spot
router.put("/:spotId", validateSpot, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

  // Check if authorized
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Edit
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  spot.update({
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

  res.json(spot);
});

// Delete a spot
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return spotNotFound(next);

  // Check if authorized
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Delete
  spot.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

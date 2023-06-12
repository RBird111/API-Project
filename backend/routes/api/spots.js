const router = require("express").Router();
const { requireAuth, isAuthorized } = require("../../utils/auth");
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const { states } = require("../../utils/states");

// Fetch functionality for Node
const fetch = require("node-fetch");

// Validation for query parameters
const validateQueryParams = [
  query("page")
    .if(query("page").exists())
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),

  query("size")
    .if(query("size").exists())
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),

  query("maxLat")
    .if(query("maxLat").exists())
    .custom((value) => {
      if (value > 90) return false;
      return true;
    })
    .withMessage("Maximum latitude is invalid"),

  query("minLat")
    .if(query("minLat").exists())
    .custom((value) => {
      if (value < -90) return false;
      return true;
    })
    .withMessage("Minimum latitude is invalid"),

  query("maxLng")
    .if(query("maxLng").exists())
    .custom((value) => {
      if (value > 180) return false;
      return true;
    })
    .withMessage("Maximum longitude is invalid"),

  query("minLng")
    .if(query("minLng").exists())
    .custom((value) => {
      if (value < -180) return false;
      return true;
    })
    .withMessage("Minimum longitude is invalid"),

  query("minPrice")
    .if(query("minPrice").exists())
    .custom((value) => {
      if (value < 0) return false;
      return true;
    })
    .withMessage("Minimum price must be greater than or equal to 0"),

  query("maxPrice")
    .if(query("maxPrice").exists())
    .custom((value) => {
      if (value < 0) return false;
      return true;
    })
    .withMessage("Maximum price must be greater than or equal to 0"),

  handleValidationErrors,
];

// Get all spots
router.get("/", validateQueryParams, async (req, res, next) => {
  const { Op } = require("sequelize");

  // Handle query params
  const page = req.query.page ? Math.min(req.query.page, 10) : 1;
  const size = req.query.size ? Math.min(req.query.size, 20) : 20;

  const limit = size;
  const offset = size * (page - 1);

  const where = {};
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  where.lat = {
    [Op.gte]: minLat ? minLat : -90,
    [Op.lte]: maxLat ? maxLat : 90,
  };

  where.lng = {
    [Op.gte]: minLng ? minLng : -180,
    [Op.lte]: maxLng ? maxLng : 180,
  };

  where.price = {
    [Op.gte]: minPrice ? minPrice : 0,
    [Op.lte]: maxPrice ? maxPrice : await Spot.max("price"),
  };

  // Get spots
  const spots = await Spot.findAll({
    where,
    limit,
    offset,
    raw: true,
  });

  // Attach additional data to each
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

  res.json({ Spots: spots, page, size });
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
  if (!spot) return Spot.notFound(next);

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

// Get bookings by spot ID
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return Spot.notFound(next);

  // Check to see if user own's spot
  const ownSpot = req.user.id === spot.ownerId;
  const bookings = await spot.getBookings({ raw: true });

  // Create Bookings return array
  let Bookings = [];
  for (const booking of bookings) {
    // Get booking properties
    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } =
      booking;

    // Create booking object
    const bookObj = {
      User: await User.findOne({
        attributes: ["id", "firstName", "lastName"],
        where: { id: userId },
      }),
      id,
      spotId,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    };

    if (!ownSpot) {
      delete bookObj.User;
      delete bookObj.id;
      delete bookObj.userId;
      delete bookObj.createdAt;
      delete bookObj.updatedAt;
    }

    // Push booking obj into Bookings array
    Bookings.push(bookObj);
  }

  res.json({ Bookings });
});

// Get spot details by ID
router.get("/:spotId", async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return Spot.notFound(next);

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
  const { address, city, state, country, name, description, price } = req.body;

  const response = await fetch(
    `https://api.api-ninjas.com/v1/geocoding?country=${"United States"}&city=${city}&state=${
      states[state]
    }`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.X_API_KEY,
      },
      "Content-Type": "application/json",
    }
  );

  const result = await response.json();

  const { latitude, longitude } = result[0];

  const spot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat: latitude,
    lng: longitude,
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
  if (!spot) return Spot.notFound(next);

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

// Create a review for a spot
router.post("/:spotId/reviews", validateReview, async (req, res, next) => {
  // Check that spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return Spot.notFound(next);

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

// Validate booking body
const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Start date required."),

  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date required."),

  requireAuth,
];

// Create a booking for a spot
router.post("/:spotId/bookings", validateBooking, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return Spot.notFound(next);

  // Forbid owner from booking spot
  if (req.user.id === spot.ownerId) {
    const err = new Error("Forbidden");
    err.title = "Forbidden";
    err.errors = { message: "Can't create booking for own spot" };
    err.status = 403;
    return next(err);
  }

  // Build booking
  const { startDate, endDate } = req.body;
  const booking = await Booking.build({
    spotId: req.params.spotId,
    userId: req.user.id,
    startDate,
    endDate,
  });

  // Validate endDate
  await booking.validate();

  // Check for booking conflict
  const conflict = await booking.hasConflict();
  if (conflict instanceof Error) return next(conflict);

  await booking.save();

  res.json(booking);
});

// Edit a spot
router.put("/:spotId", validateSpot, async (req, res, next) => {
  // Check if spot exists
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return Spot.notFound(next);

  // Check if authorized
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Edit
  const { address, city, state, country, name, description, price } = req.body;

  const response = await fetch(
    `https://api.api-ninjas.com/v1/geocoding?country=${"United States"}&city=${city}&state=${
      states[state]
    }`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.X_API_KEY,
      },
      "Content-Type": "application/json",
    }
  );

  const result = await response.json();

  const { latitude, longitude } = result[0];

  spot.update({
    address,
    city,
    state,
    country,
    lat: latitude,
    lng: longitude,
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
  if (!spot) return Spot.notFound(next);

  // Check if authorized
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Delete
  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

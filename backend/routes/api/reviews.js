const router = require("express").Router();
const { requireAuth, isAuthorized } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  User,
  Spot,
  Review,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

// Review not found error
const reviewNotFound = (next) => {
  const err = new Error("Review couldn't be found");
  err.title = "Review couldn't be found";
  err.errors = { message: "Review couldn't be found" };
  err.status = 404;
  return next(err);
};

// Max images per review reached error
const maxImagesReached = (next) => {
  const err = new Error(
    "Maximum number of images for this resource was reached"
  );
  err.title = "Maximum number of images for this resource was reached";
  err.errors = {
    message: "Maximum number of images for this resource was reached",
  };
  err.status = 403;
  return next(err);
};

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

const validateImage = [
  check("url").exists({ checkFalsy: true }).withMessage("Image url required"),

  handleValidationErrors,

  requireAuth,
];

// Add image to review
router.post("/:reviewId/images", validateImage, async (req, res, next) => {
  // Check that review exists
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) return reviewNotFound(next);

  // Check user permissions
  const auth = isAuthorized(req, review.toJSON().userId);
  if (auth instanceof Error) return next(auth);

  // Check that there are less than 10 images
  const reviewImages = await review.getReviewImages();
  if (reviewImages.length > 10) return maxImagesReached(next);

  // Create image
  let newImage = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url: req.body.url,
  });
  newImage = newImage.toJSON();

  res.json({
    id: newImage.id,
    url: newImage.url,
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

// Edit a review
router.put("/:reviewId", validateReview, async (req, res, next) => {
  // Check if review exists
  const oldReview = await Review.findByPk(req.params.reviewId);
  if (!oldReview) return reviewNotFound(next);

  // Check user permissions
  const auth = isAuthorized(req, oldReview.toJSON().userId);
  if (auth instanceof Error) return next(auth);

  // Edit review
  const { review, stars } = req.body;
  const newReview = await oldReview.update({
    review,
    stars,
  });

  res.json(newReview);
});

// Delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  // Check if review exists
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) return reviewNotFound(next);

  // Check user permissions
  const { userId } = review;
  const auth = isAuthorized(req, userId);
  if (auth instanceof Error) return next(auth);

  // Delete review
  await review.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

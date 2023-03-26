const router = require("express").Router();
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth, isAuthorized } = require("../../utils/auth");

// Error moved to ReviewImage model
//
// Review Image not found error
// const reviewImageNotFound = (next) => {
//   const err = new Error("Review Image couldn't be found");
//   err.title = "Review Image couldn't be found";
//   err.errors = { message: "Review Image couldn't be found" };
//   err.status = 404;
//   return next(err);
// };

// Delete review image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  // Check if image exists
  const reviewImage = await ReviewImage.findByPk(req.params.imageId);
  if (!reviewImage) return ReviewImage.notFound(next);

  // Check if review belongs to user
  const review = await Review.findOne({ where: { id: reviewImage.reviewId } });
  const auth = isAuthorized(req, review.userId);
  if (auth instanceof Error) return next(auth);

  // Delete
  await reviewImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

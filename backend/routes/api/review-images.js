const router = require("express").Router();
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth, isAuthorized } = require("../../utils/auth");

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

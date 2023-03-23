const router = require("express").Router();
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth, isAuthorized } = require("../../utils/auth");

// Spot Image not found error
const spotImageNotFound = (next) => {
  const err = new Error("Spot Image couldn't be found");
  err.title = "Spot Image couldn't be found";
  err.errors = { message: "Spot Image couldn't be found" };
  err.status = 404;
  return next(err);
};

// Delete spot image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  // Check if spot image exists
  const spotImage = await SpotImage.findByPk(req.params.imageId);
  if (!spotImage) return spotImageNotFound(next);

  // Check if spot belongs to user
  const spot = await Spot.findOne({ where: { id: spotImage.spotId } });
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) return next(auth);

  // Delete
  await spotImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

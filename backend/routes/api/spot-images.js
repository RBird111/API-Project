const router = require("express").Router();
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth, isAuthorized } = require("../../utils/auth");

// Delete spot image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  // Check if spot image exists
  const spotImage = await SpotImage.findByPk(req.params.imageId);
  if (!spotImage) return SpotImage.notFound(next);

  // Check if spot belongs to user
  const spot = await Spot.findOne({ where: { id: spotImage.spotId } });
  const auth = isAuthorized(req, spot.ownerId);
  if (auth instanceof Error) return next(auth);

  // Delete
  await spotImage.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;

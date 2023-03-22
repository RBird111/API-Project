const express = require("express");
const { requireAuth, isAuthorized } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { User, Spot, SpotImage, Booking } = require("../../db/models");

const router = express.Router();

// Get current user's bookings
router.get("/current", requireAuth, async (req, res, next) => {
  // Get bookings
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },
    raw: true,
  });

  // Append spot to booking
  for (const booking of bookings) {
    // Find spot
    const spot = await Spot.findByPk(booking.spotId, {
      attributes: { exclude: ["createdAt", "updatedAt", "description"] },
      raw: true,
    });

    // Find previewImage
    const image = await SpotImage.findOne({
      where: { spotId: spot.id },
      raw: true,
    });
    spot.previewImage = image ? image.url : null;

    // Append spot
    booking.Spot = spot;
  }

  res.json({ Bookings: bookings });
});

module.exports = router;

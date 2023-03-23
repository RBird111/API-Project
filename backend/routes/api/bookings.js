const express = require("express");
const { requireAuth, isAuthorized } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { User, Spot, SpotImage, Booking } = require("../../db/models");

const router = express.Router();

// Booking not found error
const bookingNotFound = (next) => {
  const err = new Error("Booking couldn't be found");
  err.title = "Booking couldn't be found";
  err.errors = { message: "Booking couldn't be found" };
  err.status = 404;
  return next(err);
};

// Booking expired error
const expiredBookingError = (next) => {
  const err = new Error("Past bookings can't be modified");
  err.title = "Past bookings can't be modified";
  err.errors = { message: "Past bookings can't be modified" };
  err.status = 403;
  return next(err);
};

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

// Validate booking body
const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Start date required."),

  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date required."),

  handleValidationErrors,

  requireAuth,
];

// Edit booking
router.put("/:bookingId", validateBooking, async (req, res, next) => {
  // Check if booking exists
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) return bookingNotFound(next);

  // Check if authorized
  const auth = isAuthorized(req, booking.userId);
  if (auth instanceof Error) {
    return next(auth);
  }

  // Verify booking isn't past endDate
  if (new Date(booking.endDate).getTime() < new Date().getTime()) {
    return expiredBookingError(next);
  }

  // Edit
  const { startDate, endDate } = req.body;
  await booking.set({ startDate, endDate });

  // Validate endDate
  await booking.validate();

  // Check for booking conflict
  const conflict = await booking.hasConflict();
  if (conflict instanceof Error) return next(conflict);

  await booking.save();

  res.json(booking);
});

module.exports = router;

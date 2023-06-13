"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    // Check if booking dates are in conflict with any other bookings
    async hasConflict(update = false) {
      // Grab start and end dates from booking instance
      const startDate = new Date(this.startDate);

      const endDate = new Date(this.endDate);

      const { Op } = require("sequelize");
      // Only consider bookings for the same spot
      const where = {
        spotId: this.spotId,
      };
      // If we're updating a booking than exclude the booking being updated
      if (update) where.id = { [Op.not]: this.id };

      // Grab dates from all booking instances
      const allBookings = await Booking.findAll({
        where,
        raw: true,
      });

      for (const booking of allBookings) {
        const [sY, sM, sD] = booking.startDate.split("-");
        const sDate = new Date(parseInt(sY), parseInt(sM) - 1, parseInt(sD));

        const [eY, eM, eD] = booking.endDate.split("-");
        const eDate = new Date(parseInt(eY), parseInt(eM) - 1, parseInt(eD));

        // If a booking instance has conflicting start/end dates
        if (
          (startDate < eDate && startDate > sDate) ||
          (endDate > sDate && endDate < eDate)
        ) {
          const errors = {};
          // Add error if start date conflicts
          if (startDate < eDate && startDate > sDate) {
            errors.startDate = "Start date conflicts with an existing booking";
          }

          // Add error if end date conflicts
          if (endDate > sDate && endDate < eDate) {
            errors.endDate = "End date conflicts with an existing booking";
          }

          // Create error object
          const err = new Error(
            "Sorry, this spot is already booked for the specified dates"
          );
          err.status = 403;
          err.title =
            "Sorry, this spot is already booked for the specified dates";
          err.errors = errors;

          // Return error object to caller
          return err;
        }
      }
    }

    // Booking not found error
    static notFound(next) {
      const err = new Error("Booking couldn't be found");
      err.title = "Booking couldn't be found";
      err.errors = { message: "Booking couldn't be found" };
      err.status = 404;
      return next(err);
    }

    // Booking expired error
    static isExpired(next) {
      const err = new Error("Past bookings can't be modified");
      err.title = "Past bookings can't be modified";
      err.errors = { message: "Past bookings can't be modified" };
      err.status = 403;
      return next(err);
    }

    // Booking start date has passed error
    static inProgress(next) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.title = "Bookings that have been started can't be deleted";
      err.errors = {
        message: "Bookings that have been started can't be deleted",
      };
      err.status = 403;
      return next(err);
    }

    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });

      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "cascade",
      });
    }
  }

  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfterStart(value) {
            if (value <= this.startDate) {
              throw new Error("endDate cannot come before startDate");
            }
          },
          isNotPast(value) {
            if (new Date(value).getTime() <= new Date().getTime()) {
              throw new Error("endDate cannot come before current date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};

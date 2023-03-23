"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    // Check if booking dates are in conflict with any other bookings
    async hasConflict() {
      // Grab start and end dates from booking instance
      const startDate = this.startDate.getTime();

      const endDate = this.endDate.getTime();

      // Grab dates from all booking instances
      const allBookings = await Booking.findAll({ raw: true });
      for (const booking of allBookings) {
        const [sY, sM, sD] = booking.startDate.split("-");
        const sDate = new Date(
          parseInt(sY),
          parseInt(sM) - 1,
          parseInt(sD)
        ).getTime();

        const [eY, eM, eD] = booking.endDate.split("-");
        const eDate = new Date(
          parseInt(eY),
          parseInt(eM) - 1,
          parseInt(eD)
        ).getTime();

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

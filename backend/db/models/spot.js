"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    // Spot not found error
    static notFound(next) {
      const err = new Error("Spot couldn't be found");
      err.title = "Spot couldn't be found";
      err.errors = { message: "Spot couldn't be found" };
      err.status = 404;
      return next(err);
    }

    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        onDelete: "cascade",
      });
      Spot.belongsTo(models.User, {
        as: "Owner",
        foreignKey: "ownerId",
        onDelete: "cascade",
      });

      Spot.hasMany(models.Booking, { foreignKey: "spotId" });

      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" });

      Spot.hasMany(models.Review, { foreignKey: "spotId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};

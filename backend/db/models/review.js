"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    // Review not found error
    static notFound(next) {
      const err = new Error("Review couldn't be found");
      err.title = "Review couldn't be found";
      err.errors = { message: "Review couldn't be found" };
      err.status = 404;
      return next(err);
    }

    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "cascade",
      });

      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });

      Review.hasMany(models.ReviewImage, { foreignKey: "reviewId" });
    }
  }
  Review.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Review",
      // defaultScope: {
      //   attributes: {
      //     exclude: ["createdAt", "updatedAt"],
      //   },
      // },
    }
  );
  return Review;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    // ReviewImage not found error
    static notFound(next) {
      const err = new Error("Review Image couldn't be found");
      err.title = "Review Image couldn't be found";
      err.errors = { message: "Review Image couldn't be found" };
      err.status = 404;
      return next(err);
    }

    // Max images reached error
    static maxReached(next) {
      const err = new Error(
        "Maximum number of images for this resource was reached"
      );
      err.title = "Maximum number of images for this resource was reached";
      err.errors = {
        message: "Maximum number of images for this resource was reached",
      };
      err.status = 403;
      return next(err);
    }

    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: "cascade",
      });
    }
  }
  ReviewImage.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return ReviewImage;
};

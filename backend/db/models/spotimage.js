"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    // SpotImage not found error
    static notFound(next) {
      const err = new Error("Spot Image couldn't be found");
      err.title = "Spot Image couldn't be found";
      err.errors = { message: "Spot Image couldn't be found" };
      err.status = 404;
      return next(err);
    }

    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "cascade",
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SpotImage",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return SpotImage;
};

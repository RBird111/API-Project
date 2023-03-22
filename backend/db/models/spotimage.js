"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
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
      },
      url: {
        type: DataTypes.STRING,
      },
      preview: {
        type: DataTypes.BOOLEAN,
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

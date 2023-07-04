"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const spotImages = [];
const spotImageData = require("./spot_image_data.json");
spotImageData.forEach((arr, i) => {
  arr.forEach((img, j) => {
    spotImages.push({
      spotId: i + 1,
      url: img.url,
      preview: !j ? true : false,
    });
  });
});

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(options, spotImages, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        url: { [Op.in]: spotImages.map((img) => img.url) },
      },
      {}
    );
  },
};

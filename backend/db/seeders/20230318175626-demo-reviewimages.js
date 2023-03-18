"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 3,
          url: "https://reviewimages.com/1",
        },
        {
          reviewId: 2,
          url: "https://reviewimages.com/2",
        },
        {
          reviewId: 1,
          url: "https://reviewimages.com/3",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};

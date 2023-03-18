"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 3,
          review: "Review for Spot 1",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 1,
          review: "Review for Spot 2",
          stars: 2,
        },
        {
          spotId: 3,
          userId: 2,
          review: "Review for Spot 3",
          stars: 5,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    await queryInterface(
      options,
      {
        id: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
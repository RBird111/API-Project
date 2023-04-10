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
          spotId: 1,
          userId: 1,
          review: "Review 2 for Spot 1",
          stars: 3,
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
        {
          spotId: 4,
          userId: 4,
          review: "Review for Spot 4",
          stars: 4,
        },
        {
          spotId: 5,
          userId: 3,
          review: "Review for Spot 5",
          stars: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3, 4, 5, 6] },
      },
      {}
    );
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: "2023/3/15",
        endDate: "2023/3/18",
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2023/2/15",
        endDate: "2023/2/18",
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2023/1/15",
        endDate: "2023/1/18",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
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

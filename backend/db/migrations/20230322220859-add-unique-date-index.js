"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    await queryInterface.addIndex(
      options,
      ["startDate", "endDate"],
      {
        unique: true,
        name: 'startDate-endDate'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    await queryInterface.removeIndex(options, "startDate-endDate");
  },
};

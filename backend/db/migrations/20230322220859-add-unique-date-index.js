"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.unique = true;
    options.name = "startDate-endDate";
    await queryInterface.addIndex(
      "Bookings",
      ["startDate", "endDate"],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Bookings", "startDate-endDate", options);
  },
};

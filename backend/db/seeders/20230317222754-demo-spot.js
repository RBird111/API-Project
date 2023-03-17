"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Test St.",
        city: "City1",
        state: "TS",
        country: "US",
        lat: 34.865,
        lng: -106.536,
        name: "Spot1",
        description: "Description for Spot1",
        price: 900.25,
      },
      {
        ownerId: 2,
        address: "456 Test St.",
        city: "City2",
        state: "TS",
        country: "US",
        lat: 34.865,
        lng: -106.536,
        name: "Spot2",
        description: "Description for Spot2",
        price: 1900.25,
      },
      {
        ownerId: 1,
        address: "789 Test St.",
        city: "City3",
        state: "TS",
        country: "US",
        lat: 34.865,
        lng: -106.536,
        name: "Spot3",
        description: "Description for Spot3",
        price: 12700.25,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Spot1", "Spot2", "Spot3"] },
      },
      {}
    );
  },
};

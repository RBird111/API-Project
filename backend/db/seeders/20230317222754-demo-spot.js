"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 Test St.",
          city: "Telluride",
          state: "Colorado",
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
          city: "Granite Falls",
          state: "Wyoming",
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
          city: "Shell Knob",
          state: "Missouri",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot3",
          description: "Description for Spot3",
          price: 830.0,
        },
        {
          ownerId: 3,
          address: "1789 Test St.",
          city: "Indian River",
          state: "Michigan",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot4",
          description: "Description for Spot4",
          price: 592.56,
        },
        {
          ownerId: 4,
          address: "2789 Test St.",
          city: "Blue Ridge",
          state: "Georgia",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot5",
          description: "Description for Spot5",
          price: 164.75,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};

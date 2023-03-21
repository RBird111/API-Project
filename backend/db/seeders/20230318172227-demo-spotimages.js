"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://www.test.com",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://www.test.com/2",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://www.test2.com",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://www.test3.com",
          preview: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        id: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};

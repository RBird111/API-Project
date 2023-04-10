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
          url: "https://a0.muscache.com/im/pictures/751e1606-5d0d-44a9-aa8f-c5c62cf32481.jpg?im_w=1200",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://www.test.com/2",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-30109719/original/601996fa-4df1-4978-a7fd-c56c4078a3b0.jpeg?im_w=1200",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/3d35e428-5ce0-4e91-ad16-5d005324a950.jpg?im_w=1200",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-38105331/original/3254dc9a-7639-4139-917d-f2ed2bea0e4f.jpeg?im_w=1200",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-52254969/original/94fc072d-a957-4812-aba7-1e6fcb0ecc5c.jpeg?im_w=1200",
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
        id: { [Op.in]: [1, 2, 3, 4, 5, 6] },
      },
      {}
    );
  },
};

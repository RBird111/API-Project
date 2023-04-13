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
          url: "https://a0.muscache.com/im/pictures/d254cadf-ce67-412c-800d-4b75b0f29dc3.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/34406e66-b5e0-4cff-a21c-d77f891ed2f4.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/37cb41bc-9e79-4280-8074-7297e38c79d8.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-30109719/original/601996fa-4df1-4978-a7fd-c56c4078a3b0.jpeg?im_w=1200",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-38601043/original/7d5beb43-7723-4733-b353-0a520e06e70a.jpeg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-38601043/original/2b5e7d61-767f-4d8d-a7f2-95eefe3c224f.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-20605023/original/0be3f493-fd2d-434e-b557-ad2c189b1543.jpeg?im_w=1200",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-20605023/original/54a54b14-9c99-4b06-a89b-a825c73879d7.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-20605023/original/cfdf38c5-f9c0-4d45-bdaf-c7fdfa0953e5.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-659600087552092324/original/22ee9232-35fd-4f24-a34f-663a02a3aa32.jpeg?im_w=720",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-44274750/original/f1474bd5-16a7-4699-b33a-b036f2f37c8e.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-44274750/original/a69c6a71-6955-4e9f-89b1-1954decb5e9c.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-44274750/original/9ddd6816-a04a-47ac-ab28-b13edb136ad0.jpeg?im_w=720",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/807af64a-c3ba-4075-9b76-e1f09531c974.jpg?im_w=1200",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/ef9ae79b-f360-4a31-adf1-9eb4edede987.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/95775f86-8ef8-4d59-bd48-b8f4c93842a4.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/b8ab02bf-4688-48c5-9a42-1bdab868088e.jpg?im_w=720",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://a0.muscache.com/im/pictures/10d23cb8-d30a-4256-abdc-be2b14824219.jpg?im_w=720",
          preview: false,
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

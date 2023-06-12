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
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ullamcorper a lacus vestibulum sed arcu non odio. Egestas egestas fringilla phasellus faucibus. Lacus laoreet non curabitur gravida arcu ac. Amet purus gravida quis blandit turpis cursus in hac. Dui id ornare arcu odio ut sem nulla pharetra diam. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Aliquam ultrices sagittis orci a scelerisque purus semper. In ornare quam viverra orci. Pharetra magna ac placerat vestibulum lectus. Fermentum iaculis eu non diam phasellus vestibulum. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis.",
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
          description:
            "Rutrum tellus pellentesque eu tincidunt. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Convallis convallis tellus id interdum. Cursus mattis molestie a iaculis. Et tortor consequat id porta nibh venenatis. Tellus elementum sagittis vitae et leo. Libero justo laoreet sit amet. At volutpat diam ut venenatis tellus in. Diam sit amet nisl suscipit adipiscing bibendum est. Pretium fusce id velit ut tortor pretium viverra. Aliquet lectus proin nibh nisl condimentum id venenatis a. Nulla malesuada pellentesque elit eget gravida. Porta non pulvinar neque laoreet suspendisse interdum consectetur. Ornare lectus sit amet est placerat in egestas. Duis at tellus at urna condimentum mattis.",
          price: 1900.25,
        },
        {
          ownerId: 3,
          address: "789 Test St.",
          city: "Shell Knob",
          state: "Missouri",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot3",
          description:
            "Sed enim ut sem viverra aliquet eget. Viverra mauris in aliquam sem fringilla ut. Eu mi bibendum neque egestas congue quisque. Quam adipiscing vitae proin sagittis nisl. Sagittis aliquam malesuada bibendum arcu vitae. Justo nec ultrices dui sapien eget mi proin sed libero. Massa enim nec dui nunc mattis enim ut tellus. Facilisis sed odio morbi quis. Bibendum at varius vel pharetra vel. Et netus et malesuada fames ac turpis egestas maecenas. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Amet venenatis urna cursus eget nunc. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Urna porttitor rhoncus dolor purus non enim praesent elementum facilisis. Rhoncus aenean vel elit scelerisque. Arcu bibendum at varius vel pharetra vel turpis.",
          price: 830.0,
        },
        {
          ownerId: 4,
          address: "1789 Test St.",
          city: "Indian River",
          state: "Michigan",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot4",
          description:
            "Massa eget egestas purus viverra accumsan in. Lorem sed risus ultricies tristique nulla. Rhoncus est pellentesque elit ullamcorper dignissim cras. Euismod in pellentesque massa placerat duis. Arcu risus quis varius quam quisque id diam vel. Adipiscing diam donec adipiscing tristique risus. Ligula ullamcorper malesuada proin libero. Risus ultricies tristique nulla aliquet enim tortor at. Tincidunt dui ut ornare lectus sit amet est placerat. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non. Quam quisque id diam vel. Duis tristique sollicitudin nibh sit. Quis eleifend quam adipiscing vitae proin sagittis nisl.",
          price: 592.56,
        },
        {
          ownerId: 1,
          address: "2789 Test St.",
          city: "Blue Ridge",
          state: "Georgia",
          country: "US",
          lat: 34.865,
          lng: -106.536,
          name: "Spot5",
          description:
            "Elit at imperdiet dui accumsan sit amet nulla facilisi morbi. Pellentesque nec nam aliquam sem et tortor consequat id porta. Est ultricies integer quis auctor elit sed. Quam quisque id diam vel quam elementum pulvinar etiam non. Id interdum velit laoreet id donec ultrices. Purus faucibus ornare suspendisse sed nisi. In ornare quam viverra orci sagittis. Aliquet sagittis id consectetur purus ut. Dignissim diam quis enim lobortis. Sit amet nisl purus in mollis nunc sed id. Egestas tellus rutrum tellus pellentesque eu tincidunt.",
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

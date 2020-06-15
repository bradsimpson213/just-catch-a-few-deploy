const bcrypt = require("bcryptjs");

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert(
        "Users",
        [
          {
            userName: "Guest",
            email: "guest@guest.com",
            hashedPassword: bcrypt.hashSync("guest", 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userName: "Brads213",
            email: "bradsimpson@icloud.com",
            hashedPassword: bcrypt.hashSync("brads", 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userName: "Andy1111",
            email: "andysimpson1111@gmail.com",
            hashedPassword: bcrypt.hashSync("andys", 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
        {}
      );
  
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

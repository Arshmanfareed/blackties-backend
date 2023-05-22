'use strict'
const bcrypt = require("bcryptjs")
const { status, roles } =  require('../config/constants')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = "Mahaba@!"
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await queryInterface.bulkInsert('Users', [{
      role: roles.ADMIN,
      username: 'Admin',
      email: 'mahaba@gmail.com',
      password: hashed,
      status: status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
}
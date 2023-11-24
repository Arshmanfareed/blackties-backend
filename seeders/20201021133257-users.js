'use strict'
const bcrypt = require("bcryptjs")
const { status, roles } =  require('../config/constants')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = "Mahaba@!"
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    let usersCreated = await queryInterface.bulkInsert(
      'Users',
      [
        {
          role: roles.USER,
          email: "dummy_user1@yopmail.com", 
          username: "dummy_user1", 
          password: hashed, 
          status: status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: roles.USER,
          email: "dummy_user2@yopmail.com", 
          username: "dummy_user2", 
          password: hashed, 
          status: status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: roles.USER,
          email: "dummy_user3@yopmail.com", 
          username: "dummy_user3", 
          password: hashed, 
          status: status.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    )
    console.log("usersCreated => ", usersCreated)
    // creating user Profiles
    // for (let user of usersCreated) {
    //   await queryInterface.bulkInsert(
    //     'Profiles',
    //     [
    //       {
    //         userId: user.id, 
    //         sex: "Male", 
    //         dateOfBirth: "2001-02-03", 
    //         height: 160, 
    //         weight: 150, 
    //         country: "Pakistan", 
    //         city: "Karachi", 
    //         nationality: "Pakistani", 
    //         religiosity: "Religious", 
    //         education: "Bachelors", 
    //         skinColor: "White", 
    //         ethnicity: "Persian", 
    //         maritalStatus: "Single",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   )
    //   await queryInterface.bulkInsert(
    //     'UserLanguages',
    //     [
    //       {
    //         userId: user.id,
    //         language: "English",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //       {
    //         userId: user.id,
    //         language: "Urdu",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   )
    //   await queryInterface.bulkInsert(
    //     'Wallet',
    //     [
    //       {
    //         userId: user.id,
    //         amount: 0,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   )
    //   await queryInterface.bulkInsert(
    //     'UserSetting',
    //     [
    //       {
    //         userId: user.id,
    //         isNotificationEnabled: true, 
    //         isPremium: false,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   )
    // }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return Promise.all[
      (queryInterface.bulkDelete('Users', null, {}),
        queryInterface.bulkDelete('Profiles', null, {}))
    ]
  },
}

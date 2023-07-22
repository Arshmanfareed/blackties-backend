'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['USER', 'ADMIN'],
        default: 'User',
      },
      email: {
        type: Sequelize.STRING(40),
      },
      phoneNo: {
        type: Sequelize.STRING(20),
      },
      username: {
        type: Sequelize.STRING(50),
      },
      password: {
        type: Sequelize.STRING(100),
      },
      platform: {
        type: Sequelize.STRING(20),
      },
      fcmToken: {
        type: Sequelize.STRING(200),
      },
      otp: {
        type: Sequelize.INTEGER(6),
      },
      otpExpiry: {
        type: Sequelize.DATE,
      },
      language: {
        type: Sequelize.STRING(5),
      },
      code: {
        type: Sequelize.STRING(50),
      },
      socketId: {
        type: Sequelize.STRING(50),
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE', 'BANNED', 'COMPLETED', 'FAILED', 'UNVERIFIED',],
        default: 'ACTIVE',
      },
      tempEmail: {
        type: Sequelize.STRING(40),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  },
}

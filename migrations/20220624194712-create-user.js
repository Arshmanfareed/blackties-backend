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
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      phoneNo: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.DECIMAL,
      },
      latitude: {
        type: Sequelize.DECIMAL,
      },
      city: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      profileImageUrl: {
        type: Sequelize.STRING,
      },
      platform: {
        type: Sequelize.STRING,
      },
      fcmToken: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      otpExpiry: {
        type: Sequelize.DATE,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE', 'BANNED', 'COMPLETED', 'FAILED'],
        default: 'ACTIVE',
      },
      needToReverify: {
        type: Sequelize.BOOLEAN,
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

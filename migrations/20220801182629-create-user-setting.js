'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      isNotificationEnabled: {
        type: Sequelize.BOOLEAN
      },
      isPremium: {
        type: Sequelize.BOOLEAN
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN
      },
      isPhoneVerified: {
        type: Sequelize.BOOLEAN
      },
      isFilledAllInfo: {
        type: Sequelize.BOOLEAN
      },
      membership: {
        type: Sequelize.STRING(30)
      },
      language: {
        type: Sequelize.STRING(30)
      },
      lastSeen: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserSettings');
  }
};
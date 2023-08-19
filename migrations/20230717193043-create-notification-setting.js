'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NotificationSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      receiveQuestion: {
        type: Sequelize.BOOLEAN
      },
      receiveAnswer: {
        type: Sequelize.BOOLEAN
      },
      receivePictureRequest: {
        type: Sequelize.BOOLEAN
      },
      receivePicture: {
        type: Sequelize.BOOLEAN
      },
      contactDetailsRequest: {
        type: Sequelize.BOOLEAN
      },
      getMatched: {
        type: Sequelize.BOOLEAN
      },
      matchCancelled: {
        type: Sequelize.BOOLEAN
      },
      strugglesToConnect: {
        type: Sequelize.BOOLEAN
      },
      restrictPushNotificationOfMyNationality: {
        type: Sequelize.BOOLEAN
      },
      emailNotification: {
        type: Sequelize.BOOLEAN
      },
      restrictEmailNotificationOfMyNationality: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('NotificationSettings');
  }
};
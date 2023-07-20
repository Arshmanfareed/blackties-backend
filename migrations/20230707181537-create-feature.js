'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Features', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100)
      },
      gender: {
        type: Sequelize.STRING(10)
      },
      price: {
        type: Sequelize.INTEGER(3)
      },
      featureType: {
        type: Sequelize.STRING(50)
      },
      validityType: {
        type: Sequelize.STRING(20)
      },
      count: {
        type: Sequelize.INTEGER(5)
      },
      status: {
        type: Sequelize.INTEGER(1)
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
    await queryInterface.dropTable('Features');
  }
};
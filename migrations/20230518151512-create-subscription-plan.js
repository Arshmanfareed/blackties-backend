'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SubscriptionPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.STRING(30)
      },
      name: {
        type: Sequelize.STRING(30)
      },
      gender: {
        type: Sequelize.STRING(10)
      },
      duration: {
        type: Sequelize.INTEGER(2)
      },
      price: {
        type: Sequelize.INTEGER(4)
      },
      status: {
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
    await queryInterface.dropTable('SubscriptionPlans');
  }
};
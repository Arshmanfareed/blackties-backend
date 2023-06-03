'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ContactDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contactDetailsRequestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'ContactDetailsRequests',
          key: 'id',
          as: 'contactDetailsRequestId',
        },
      },
      name: {
        type: Sequelize.STRING(30)
      },
      personToContact: {
        type: Sequelize.STRING(20)
      },
      nameOfContact: {
        type: Sequelize.STRING(30)
      },
      phoneNo: {
        type: Sequelize.STRING(20)
      },
      message: {
        type: Sequelize.STRING(100)
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
    await queryInterface.dropTable('ContactDetails');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('available', 'sold'),
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      membershipType: {
        type: Sequelize.ENUM('weekly', 'monthly', 'yearly'),
        allowNull: false,
      },
      carType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      engineType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sittingCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transmission: {
        type: Sequelize.ENUM('auto', 'manual'),
        allowNull: false,
      },
      mileage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fullyComprehensiveInsurance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      servicingMaintenance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tyreBrakeReplacement: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      driverSupport: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      racBreakdownCover: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      generousMileageAllowance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      noCreditCheckRentalOption: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rightToBuyRentedVehicle: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      realTimeVehicleMonitoring: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Vehicles');
  }
};
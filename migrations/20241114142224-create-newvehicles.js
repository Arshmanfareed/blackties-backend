'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('newvehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      car_make: {
        type: Sequelize.STRING,
        allowNull: true
      },
      car_model: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vehicle_registration_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      price_per_week: {
        type: Sequelize.STRING,
        allowNull: true
      },
      car_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      vehicle_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      transmission: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fuel_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      miles_per_gallon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      people: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      mileage_allowance: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      additional_mileage_cost: {
        type: Sequelize.STRING,
        allowNull: true
      },
      reset_period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      holding_deposit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      insurance_excess: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pcn_fee: {
        type: Sequelize.STRING,
        allowNull: false
      },      
      vehicle_gallery: {
        type: Sequelize.JSON,
        allowNull: true
      },
      mot_certificate_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      insurance_certificate_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vehicle_licence_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      permission_letter_document: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('newvehicles');
  }
};

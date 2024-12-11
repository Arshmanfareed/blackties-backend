const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('user_applications', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      driving_license_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driver_license_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      driving_license_file: {
        type: DataTypes.STRING, // Path to uploaded file
        allowNull: false,
      },
      dvla_check_code_1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dvla_check_code_2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      national_insurance_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pco_license_first_obtained: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pco_license_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },     
      pco_license_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pco_paper_copy_file: {
        type: DataTypes.STRING, // Path to uploaded file
        allowNull: true,
      },
      pco_badge_file: {
        type: DataTypes.STRING, // Path to uploaded file
        allowNull: true,
      },
      bank_statement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'not-accepted',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_applications');
  },
};

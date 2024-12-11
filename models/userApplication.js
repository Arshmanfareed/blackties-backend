'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      UserApplication.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }

  UserApplication.init(
    {
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
        type: DataTypes.STRING, // Path to bank statement file
        allowNull: true,
      },
      // New field for the first PCO license obtained date
      pco_license_first_obtained: {
        type: DataTypes.DATE,
        allowNull: true, // This field is optional for the user to provide
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UserApplication',
      tableName: 'user_applications',
      underscored: true,
    }
  );

  return UserApplication;
};

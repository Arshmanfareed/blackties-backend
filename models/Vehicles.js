'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Vehicles = sequelize.define('Vehicles', {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('available', 'sold'),
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      membershipType: {
        type: DataTypes.ENUM('weekly', 'monthly', 'yearly'),
        allowNull: true,
      },
      carType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      engineType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sittingCapacity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transmission: {
        type: DataTypes.ENUM('auto', 'manual'),
        allowNull: true,
      },
      mileage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fullyComprehensiveInsurance: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      servicingMaintenance: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      tyreBrakeReplacement: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      driverSupport: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      racBreakdownCover: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      generousMileageAllowance: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      noCreditCheckRentalOption: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      rightToBuyRentedVehicle: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      realTimeVehicleMonitoring: {
        type: DataTypes.TEXT,
        defaultValue: true,
      },
    });
  
    Vehicles.associate = (models) => {
      Vehicles.hasMany(models.VehicleGallery, {
        foreignKey: 'vehicleId',
        as: 'gallery',
        onDelete: 'CASCADE',
      });
    };
  
    return Vehicles;
  };  
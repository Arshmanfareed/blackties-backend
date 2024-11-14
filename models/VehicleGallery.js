'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const VehicleGallery = sequelize.define('VehicleGallery', {
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'NewVehicles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    VehicleGallery.associate = (models) => {
      VehicleGallery.belongsTo(models.NewVehicles, {
        foreignKey: 'vehicleId',
        as: 'vehicle',
      });
    };
  
    return VehicleGallery;
  };
  
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewVehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NewVehicles.hasMany(models.VehicleGallery, {
        foreignKey: 'vehicleId',
        as: 'gallery',
        onDelete: 'CASCADE',
      });
    }
    
  }
  NewVehicles.init({
    car_make: DataTypes.STRING,
    car_model: DataTypes.STRING,
    vehicle_registration_number: DataTypes.STRING,
    price_per_week: DataTypes.STRING,
    car_description: DataTypes.TEXT,
    vehicle_type: DataTypes.STRING,
    transmission: DataTypes.STRING,
    fuel_type: DataTypes.STRING,
    miles_per_gallon: DataTypes.STRING,
    people: DataTypes.INTEGER,
    image: DataTypes.STRING,
    mileage_allowance: DataTypes.INTEGER,
    additional_mileage_cost: DataTypes.STRING,
    reset_period: DataTypes.STRING,
    holding_deposit: DataTypes.STRING,
    insurance_excess: DataTypes.STRING,
    pcn_fee: DataTypes.STRING,
    vehicle_gallery: DataTypes.JSON,
    mot_certificate_document: DataTypes.STRING,
    insurance_certificate_document: DataTypes.STRING,
    vehicle_licence_document: DataTypes.STRING,
    permission_letter_document: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NewVehicles',
  });
  return NewVehicles;
};
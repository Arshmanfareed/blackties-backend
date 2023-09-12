'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserFeature.init({
    userId: DataTypes.INTEGER,
    featureId: DataTypes.INTEGER,
    featureType: DataTypes.STRING,
    validityType: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
    remaining: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserFeature',
  });
  return UserFeature;
};
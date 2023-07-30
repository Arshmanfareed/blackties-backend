'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LockedDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LockedDescription.init({
    userId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    unlockDate: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'LockedDescription',
  });
  return LockedDescription;
};
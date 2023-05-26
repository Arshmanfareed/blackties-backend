'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubscriptionPlan.init({
    productId: DataTypes.STRING,
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SubscriptionPlan',
  });
  return SubscriptionPlan;
};
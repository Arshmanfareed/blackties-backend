'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubscriptionFeatures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubscriptionFeatures.belongsTo(models.SubscriptionPlan, {
        foreignKey: 'subscriptionPlanId'
      })
    }
  }
  SubscriptionFeatures.init({
    subscriptionPlanId: DataTypes.INTEGER,
    featureName: DataTypes.STRING,
    featureType: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SubscriptionFeatures',
  });
  return SubscriptionFeatures;
};
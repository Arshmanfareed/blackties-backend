'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  Wallet.init({
    userId: DataTypes.INTEGER,
    amount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};
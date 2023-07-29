'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuspendedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SuspendedUser.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  SuspendedUser.init({
    userId: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    suspendEndDate: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SuspendedUser',
  });
  return SuspendedUser;
};
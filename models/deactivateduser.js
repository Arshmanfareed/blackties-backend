'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeactivatedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeactivatedUser.init({
    userId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    feedback: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DeactivatedUser',
  });
  return DeactivatedUser;
};
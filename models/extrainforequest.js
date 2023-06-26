'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExtraInfoRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExtraInfoRequest.hasMany(models.UserQuestionAnswer, {
        foreignKey: 'extraInfoRequestId'
      })
    }
  }
  ExtraInfoRequest.init({
    requesterUserId: DataTypes.INTEGER,
    requesteeUserId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ExtraInfoRequest',
  });
  return ExtraInfoRequest;
};
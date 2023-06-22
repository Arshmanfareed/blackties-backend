'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserQuestionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserQuestionAnswer.init({
    extraInfoRequestId: DataTypes.INTEGER,
    askingUserId: DataTypes.INTEGER,
    askedUserId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserQuestionAnswer',
  });
  return UserQuestionAnswer;
};
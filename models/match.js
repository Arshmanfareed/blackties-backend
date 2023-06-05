'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Match.belongsTo(models.User, {
        as: "user",
        foreignKey: 'userId',
      })

      Match.belongsTo(models.User, {
        as: "otherUser",
        foreignKey: 'otherUserId',
      })
    }
  }
  Match.init({
    userId: DataTypes.INTEGER,
    otherUserId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Match',
  });
  return Match;
};
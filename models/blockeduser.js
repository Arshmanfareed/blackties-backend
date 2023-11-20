'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlockedUser.belongsTo(models.User, {
        foreignKey: 'blockerUserId',
        as: 'blockerUser'
      });

      BlockedUser.belongsTo(models.User, {
        foreignKey: 'blockedUserId',
        as: 'blockedUser'
      });

      BlockedUser.hasMany(models.BlockReason, {
        foreignKey: 'blockedId',
      })
    }
  }
  BlockedUser.init({
    blockerUserId: DataTypes.INTEGER,
    blockedUserId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'BlockedUser',
  });
  return BlockedUser;
};
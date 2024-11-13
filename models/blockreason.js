'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockReason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      BlockReason.belongsTo(models.BlockedUser, {
        foreignKey: 'blockedId',
      });
    }
  }
  BlockReason.init({
    blockedId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'BlockReason',
  });
  return BlockReason;
};
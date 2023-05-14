'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      UserSetting.belongsTo(models.User, {
        foreignKey: "userId"
      });

    }
  }
  UserSetting.init({
    userId: DataTypes.INTEGER,
    isNotificationEnabled: DataTypes.BOOLEAN,
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    membership: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserSetting',
  });
  return UserSetting;
};
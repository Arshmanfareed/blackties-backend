'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NotificationSetting.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  NotificationSetting.init({
    userId: DataTypes.INTEGER,
    receiveQuestion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    receiveAnswer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    receivePictureRequest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    contactDetailsRequest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    getMatched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    matchCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    strugglesToConnect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    restrictPushNotificationOfMyNationality: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    restrictEmailNotificationOfMyNationality: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'NotificationSetting',
  });
  return NotificationSetting;
};
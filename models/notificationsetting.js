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
      defaultValue: true,
    },
    receiveAnswer: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    receivePictureRequest: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    receivePicture: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    contactDetailsRequest: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    getMatched: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    matchCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    strugglesToConnect: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    restrictPushNotificationOfMyNationality: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'userId',
      })

      User.hasMany(models.UserLanguage, {
        foreignKey: 'userId',
      })

      User.hasMany(models.BlockedUser, {
        foreignKey: 'blockerUserId',
        as: 'blockerUser',
      })

      User.hasMany(models.BlockedUser, {
        foreignKey: 'blockedUserId',
        as: 'blockedUser',
      })

      User.hasMany(models.SavedProfile, {
        foreignKey: 'userId',
      })

      User.hasMany(models.SavedProfile, {
        foreignKey: 'savedUserId',
      })

      User.hasMany(models.Match, {
        as: 'user',
        foreignKey: 'userId'
      })

      User.hasMany(models.Match, {
        as: "otherUser",
        foreignKey: 'otherUserId'
      })

      User.hasMany(models.ContactDetailsRequest, {
        as: 'requesterUser',
        foreignKey: 'requesterUserId'
      })

      User.hasMany(models.ContactDetailsRequest, {
        as: "requesteeUser",
        foreignKey: 'requesteeUserId'
      })

      User.hasOne(models.Wallet, {
        foreignKey: 'userId',
      })

      User.hasOne(models.UserSetting, {
        foreignKey: 'userId',
      })

      User.hasMany(models.PictureRequest, {
        as: 'pictureRequesterUser',
        foreignKey: 'requesterUserId'
      })

      User.hasMany(models.PictureRequest, {
        as: "pictureRequesteeUser",
        foreignKey: 'requesteeUserId'
      })

      User.hasMany(models.UserSeen, {
        foreignKey: 'viewerId',
      })

      User.hasMany(models.UserSeen, {
        foreignKey: 'viewedId',
      })

      User.hasMany(models.ExtraInfoRequest, {
        foreignKey: 'requesterUserId',
      })

      User.hasMany(models.ExtraInfoRequest, {
        foreignKey: 'requesteeUserId',
      })

      User.hasOne(models.NotificationSetting, {
        foreignKey: 'userId',
      })

      User.hasOne(models.DeactivatedUser, {
        foreignKey: 'userId',
      })

      User.hasOne(models.SuspendedUser, {
        foreignKey: 'userId',
      })

      User.hasOne(models.LockedDescription, {
        foreignKey: 'userId',
      })

      User.hasMany(models.Notification, {
        foreignKey: 'resourceId',
      })
    }
  }
  User.init(
    {
      role: DataTypes.INTEGER,      
      email: DataTypes.STRING,
      phoneNo: DataTypes.STRING,
      username: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      password: DataTypes.STRING,
      platform: DataTypes.STRING,
      fcmToken: DataTypes.STRING,
      code: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      otpExpiry: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'ACTIVE',
      },
      socketId: DataTypes.STRING,
      language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'united_states_dollar'
      },
      tempEmail: DataTypes.STRING,
      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLogin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}

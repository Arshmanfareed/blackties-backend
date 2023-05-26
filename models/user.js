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
      })

      User.hasMany(models.BlockedUser, {
        foreignKey: 'blockedUserId',
      })

      User.hasMany(models.SavedProfile, {
        foreignKey: 'userId',
      })

      User.hasMany(models.SavedProfile, {
        foreignKey: 'savedUserId',
      })
    }
  }
  User.init(
    {
      role: DataTypes.INTEGER,
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      platform: DataTypes.STRING,
      fcmToken: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      otpExpiry: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'ACTIVE',
      },
      deletedAt: DataTypes.DATE,
      language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}

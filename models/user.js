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
    }
  }
  User.init(
    {
      role: DataTypes.INTEGER,
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNo: DataTypes.STRING,
      password: DataTypes.STRING,
      longitude: DataTypes.DECIMAL,
      latitude: DataTypes.DECIMAL,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      address: DataTypes.STRING,
      profileImageUrl: DataTypes.STRING,
      platform: DataTypes.STRING,
      fcmToken: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      otpExpiry: DataTypes.DATE,
      needToReverify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 'ACTIVE',
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}

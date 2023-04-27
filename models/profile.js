'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  Profile.init(
    {
      userId: DataTypes.INTEGER,
      sex: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      height: DataTypes.DOUBLE,
      weight: DataTypes.DOUBLE,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      nationality: DataTypes.STRING,
      religiosity: DataTypes.STRING,
      education: DataTypes.STRING,
      skinColor: DataTypes.STRING,
      ethnicity: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  )
  return Profile
}

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
      height: DataTypes.DOUBLE,
      dob: DataTypes.DATE,
      tagline: DataTypes.STRING,
      zodiacSign: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      familyOrigin: DataTypes.STRING,
      community: DataTypes.STRING,
      religion: DataTypes.STRING,
      denomination: DataTypes.STRING,
      practiceLevel: DataTypes.STRING,
      iPray: DataTypes.STRING,
      iDrink: DataTypes.STRING,
      education: DataTypes.STRING,
      school: DataTypes.STRING,
      occupation: DataTypes.STRING,
      marriageTimeline: DataTypes.STRING,
      maritalHistory: DataTypes.STRING,
      haveKids: DataTypes.BOOLEAN,
      wantKids: DataTypes.BOOLEAN,
      willingToRelocate: DataTypes.BOOLEAN,
      countryCode: DataTypes.STRING,
      personalityType: DataTypes.STRING,
      vibes: DataTypes.ARRAY(DataTypes.STRING),
      noOfProfilesRemaining: {
        type: DataTypes.INTEGER,
        defaultValue: process.env.NO_OF_PROFILES_FOR_FREE
      },
      totalNoOfProfiles: {
        type: DataTypes.INTEGER,
        defaultValue: process.env.NO_OF_PROFILES_FOR_FREE
      }
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  )
  return Profile
}

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
      maritalStatus: DataTypes.STRING,
      occupationStatus: DataTypes.STRING, 
      occupationField: DataTypes.STRING,
      occupationFunction: DataTypes.STRING,
      countryOfEducation: DataTypes.STRING,
      speciality: DataTypes.STRING,
      financialStatus: DataTypes.STRING,
      healthStatus: DataTypes.STRING,
      children: DataTypes.STRING,
      fatherCountryOfOrigin: DataTypes.STRING,
      motherCountryOfOrigin: DataTypes.STRING,
      tribe: DataTypes.STRING,
      sect: DataTypes.STRING,
      frequencyOfPrayers: DataTypes.STRING,
      beard: DataTypes.STRING,
      reading: DataTypes.STRING,
      family: DataTypes.STRING,
      smoking: DataTypes.STRING,
      physicalActivity: DataTypes.STRING,
      readyToRelocate: DataTypes.STRING,
      willingnessToMarry: DataTypes.STRING,
      familyPlans: DataTypes.STRING,
      eyesColor: DataTypes.STRING,
      hairLength: DataTypes.STRING,
      hairType: DataTypes.STRING,
      hairColor: DataTypes.STRING,
      beauty: DataTypes.STRING,
      personalityType: DataTypes.STRING,
      traits: DataTypes.STRING,
      noAFanOf: DataTypes.STRING,
      letsTalkAbout: DataTypes.STRING,
      hobbies: DataTypes.STRING,
      movies: DataTypes.STRING,
      sports: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  )
  return Profile
}

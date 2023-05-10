'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      sex: {
        type: Sequelize.STRING,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
      },
      height: {
        type: Sequelize.DOUBLE,
      },
      weight: {
        type: Sequelize.DOUBLE,
      },
      longitude: {
        type: Sequelize.DECIMAL,
      },
      latitude: {
        type: Sequelize.DECIMAL,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      religiosity: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      skinColor: {
        type: Sequelize.STRING,
      },
      ethnicity: {
        type: Sequelize.STRING,
      },
      maritalStatus: {
        type: Sequelize.STRING,
      },
      occupationField: {
        type: Sequelize.STRING,
      },
      occupationFunction: {
        type: Sequelize.STRING,
      },
      countryOfEducation: {
        type: Sequelize.STRING,
      },
      speciality: {
        type: Sequelize.STRING,
      },
      financialStatus: {
        type: Sequelize.STRING,
      },
      healthStatus: {
        type: Sequelize.STRING,
      },
      children: {
        type: Sequelize.STRING,
      },
      fatherCountryOfOrigin: {
        type: Sequelize.STRING,
      },
      motherCountryOfOrigin: {
        type: Sequelize.STRING,
      },
      tribe: {
        type: Sequelize.STRING,
      },
      sect: {
        type: Sequelize.STRING,
      },
      frequencyOfPrayers: {
        type: Sequelize.STRING,
      },
      beard: {
        type: Sequelize.STRING,
      },
      reading: {
        type: Sequelize.STRING,
      },
      family: {
        type: Sequelize.STRING,
      },
      smoking: {
        type: Sequelize.STRING,
      },
      physicalActivity: {
        type: Sequelize.STRING,
      },
      readyToRelocate: {
        type: Sequelize.STRING,
      },
      willingnessToMarry: {
        type: Sequelize.STRING,
      },
      familyPlans: {
        type: Sequelize.STRING,
      },
      eyesColor: {
        type: Sequelize.STRING,
      },
      hairLength: {
        type: Sequelize.STRING,
      },
      hairType: {
        type: Sequelize.STRING,
      },
      hairColor: {
        type: Sequelize.STRING,
      },
      beauty: {
        type: Sequelize.STRING,
      },
      personalityType: {
        type: Sequelize.STRING,
      },
      traits: {
        type: Sequelize.STRING,
      },
      noAFanOf: {
        type: Sequelize.STRING,
      },
      letsTalkAbout: {
        type: Sequelize.STRING,
      },
      hobbies: {
        type: Sequelize.STRING,
      },
      movies: {
        type: Sequelize.STRING,
      },
      sports: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles')
  },
}

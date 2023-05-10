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
        type: Sequelize.STRING(10),
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
        type: Sequelize.STRING(30),
      },
      city: {
        type: Sequelize.STRING(30),
      },
      nationality: {
        type: Sequelize.STRING(30),
      },
      religiosity: {
        type: Sequelize.STRING(30),
      },
      education: {
        type: Sequelize.STRING(30),
      },
      skinColor: {
        type: Sequelize.STRING(30),
      },
      ethnicity: {
        type: Sequelize.STRING(30),
      },
      maritalStatus: {
        type: Sequelize.STRING(30),
      },
      occupationField: {
        type: Sequelize.STRING(30),
      },
      occupationFunction: {
        type: Sequelize.STRING(150),
      },
      countryOfEducation: {
        type: Sequelize.STRING(30),
      },
      speciality: {
        type: Sequelize.STRING(50),
      },
      financialStatus: {
        type: Sequelize.STRING(30),
      },
      healthStatus: {
        type: Sequelize.STRING(30),
      },
      children: {
        type: Sequelize.STRING(30),
      },
      fatherCountryOfOrigin: {
        type: Sequelize.STRING(30),
      },
      motherCountryOfOrigin: {
        type: Sequelize.STRING(30),
      },
      tribe: {
        type: Sequelize.STRING(50),
      },
      sect: {
        type: Sequelize.STRING(20),
      },
      frequencyOfPrayers: {
        type: Sequelize.STRING(30),
      },
      beard: {
        type: Sequelize.STRING(20),
      },
      reading: {
        type: Sequelize.STRING(150),
      },
      family: {
        type: Sequelize.STRING(50),
      },
      smoking: {
        type: Sequelize.STRING(50),
      },
      physicalActivity: {
        type: Sequelize.STRING(50),
      },
      readyToRelocate: {
        type: Sequelize.STRING(50),
      },
      willingnessToMarry: {
        type: Sequelize.STRING(50),
      },
      familyPlans: {
        type: Sequelize.STRING(150),
      },
      eyesColor: {
        type: Sequelize.STRING(50),
      },
      hairLength: {
        type: Sequelize.STRING(50),
      },
      hairType: {
        type: Sequelize.STRING(50),
      },
      hairColor: {
        type: Sequelize.STRING(50),
      },
      beauty: {
        type: Sequelize.STRING(50),
      },
      personalityType: {
        type: Sequelize.STRING(50),
      },
      traits: {
        type: Sequelize.STRING(500),
      },
      noAFanOf: {
        type: Sequelize.STRING(500),
      },
      letsTalkAbout: {
        type: Sequelize.STRING(500),
      },
      hobbies: {
        type: Sequelize.STRING(500),
      },
      movies: {
        type: Sequelize.STRING(500),
      },
      sports: {
        type: Sequelize.STRING(500),
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

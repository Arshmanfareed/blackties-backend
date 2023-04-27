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
      height: {
        type: Sequelize.DOUBLE,
      },
      dob: {
        type: Sequelize.DATE,
      },
      tagline: {
        type: Sequelize.STRING,
      },
      zodiacSign: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      familyOrigin: {
        type: Sequelize.STRING,
      },
      community: {
        type: Sequelize.STRING,
      },
      religion: {
        type: Sequelize.STRING,
      },
      denomination: {
        type: Sequelize.STRING,
      },
      practiceLevel: {
        type: Sequelize.STRING,
      },
      iPray: {
        type: Sequelize.STRING,
      },
      iDrink: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      school: {
        type: Sequelize.STRING,
      },
      occupation: {
        type: Sequelize.STRING,
      },
      marriageTimeline: {
        type: Sequelize.STRING,
      },
      maritalHistory: {
        type: Sequelize.STRING,
      },
      haveKids: {
        type: Sequelize.BOOLEAN,
      },
      wantKids: {
        type: Sequelize.BOOLEAN,
      },
      willingToRelocate: {
        type: Sequelize.BOOLEAN,
      },
      countryCode: {
        type: Sequelize.STRING,
      },
      personalityType: {
        type: Sequelize.STRING,
      },
      vibes: {
        type: Sequelize.ARRAY(DataTypes.STRING),
      },
      noOfProfilesRemaining: {
        type: Sequelize.INTEGER,
        default: process.env.NO_OF_PROFILES_FOR_FREE
      },
      totalNoOfProfiles: {
        type: Sequelize.INTEGER,
        default: process.env.NO_OF_PROFILES_FOR_FREE
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

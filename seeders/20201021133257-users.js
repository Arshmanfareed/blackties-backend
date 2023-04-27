'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let usersCreated = await queryInterface.bulkInsert(
      'Users',
      [
        {
          role: 'USER',
          firstName: 'Ali',
          lastName: 'khan',
          phoneNo: '+923123269874',
          longitude: 67.0367744,
          latitude: 24.8774656,
          city: 'Karachi',
          country: 'Pakistan',
          address: 'Karachi, Pakistan',
          needToReverify: false,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: 'USER',
          firstName: 'Muhammad',
          lastName: '',
          phoneNo: '+923123359785',
          longitude: 67.0367744,
          latitude: 24.8774656,
          city: 'Islamabad',
          country: 'Pakistan',
          address: 'Islamabad, Pakistan',
          needToReverify: false,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    )
    // creating user Profiles
    for (let user of usersCreated) {
      await queryInterface.bulkInsert(
        'Profiles',
        [
          {
            userId: user.id,
            height: 6.2,
            dob: '1998-06-24',
            tagline: 'Sometimes it takes time to discover yourself.',
            age: 10,
            gender: 'male',
            zodiacSign: 'Cancer',
            familyOrigin: 'Pakistan',
            community: 'Hyderabadi',
            religion: 'Islam',
            denomination: 'Sunni',
            practiceLevel: 'Sometimes',
            iPray: 'Always',
            iDrink: false,
            education: 'Bachelors',
            school: 'Iqra University',
            occupation: 'Software Developer',
            marriageTimeline: 'within a couple of year',
            maritalHistory: 'None',
            haveKids: false,
            wantKids: false,
            willingToRelocate: true,
            countryCode: '+92',
            noOfProfilesRemaining: 25,
            totalNoOfProfiles: 25,
            vibes: JSON.stringify(['Gamer', 'Dreamer', 'Foodie']),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'UserLanguages',
        [
          {
            userId: user.id,
            language: "English",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userId: user.id,
            language: "Urdu",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'UserDietChoices',
        [
          {
            userId: user.id,
            choice: "Vegeterian",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'UserSmokes',
        [
          {
            userId: user.id,
            choice: "Hookah",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'UserSettings',
        [
          {
            userId: user.id,
            isNotificationEnabled: true,
            isSubscribed: false,
            discoveryMode: true,
            isDarkMode: false,
            hideAge: true,
            noOfSpotlight: 0,
            noOfReset: 0,
            chupkeChupke: false,
            hideLiveStatus: false,
            showMessagePreview: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'UserPreferences',
        [
          {
            userId: user.id,
            distance: "unlimited",
            ageTo: 68,
            ageFrom: 18,
            religion: "Islam",
            familyOrigin: "Pakistan",
            heightTo: 6.5,
            heightFrom: 4.5,
            community: "Hyderabadi",
            languagesSpoken: "Urdu",
            religiousDenomination: "Sunni",
            theyPray: "Always",
            drinking: "Drink",
            smoking: "Hookah",
            dietChoices: "Vegeterian",
            maritalHistory: "Divorced",
            haveKids: false,
            wantKids: true,
            willingToRelocate: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      await queryInterface.bulkInsert(
        'ProfilePrompts',
        [
          {
            userId: user.id,
            questionId: 6,
            answer: "To be Rich",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userId: user.id,
            questionId: 9,
            answer: "Biryani",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userId: user.id,
            questionId: 10,
            answer: "Coffee",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return Promise.all[
      (queryInterface.bulkDelete('Users', null, {}),
        queryInterface.bulkDelete('Profiles', null, {}))
    ]
  },
}

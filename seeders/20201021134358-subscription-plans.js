'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SubscriptionPlans', [
      {
        productId: 'price_1N9DIEC4S2tXm16mNWMgeRjQ',
        name: 'Gold',
        gender: 'Male',
        duration: 365, // days
        price: 240,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DH3C4S2tXm16m0Nte6blN',
        name: 'Gold',
        gender: 'Male',
        duration: 90, // days
        price: 90,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DG2C4S2tXm16muTPtJFev',
        name: 'Gold',
        gender: 'Male',
        duration: 30, // days
        price: 40,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DEIC4S2tXm16mbkqRXFZt',
        name: 'Silver',
        gender: 'Male',
        duration: 365, // days
        price: 120,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DCCC4S2tXm16mSGp5upNY',
        name: 'Silver',
        gender: 'Male',
        duration: 90, // days
        price: 60,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DAwC4S2tXm16mPnNRtpj6',
        name: 'Silver',
        gender: 'Male',
        duration: 30, // days
        price: 30,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9D7cC4S2tXm16mskC6OIPL',
        name: 'Gold',
        gender: 'Female',
        duration: 365, // days
        price: 84,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9D6bC4S2tXm16mk3dWF0k0',
        name: 'Gold',
        gender: 'Female',
        duration: 90, // days
        price: 39,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9D4OC4S2tXm16m9I1Roj1M',
        name: 'Gold',
        gender: 'Female',
        duration: 30, // days
        price: 20,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SubscriptionPlans', null, {});
  },
}
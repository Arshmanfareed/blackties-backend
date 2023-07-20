'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SubscriptionPlans', [
      {
        productId: 'price_1N9DdJC4S2tXm16mPGewyMh5',
        name: 'Gold',
        gender: 'male',
        duration: 365, // days
        price: 240,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DdcC4S2tXm16mDuQj6gmz',
        name: 'Gold',
        gender: 'male',
        duration: 90, // days
        price: 90,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9De6C4S2tXm16mfbv1uOZa',
        name: 'Gold',
        gender: 'male',
        duration: 30, // days
        price: 40,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DeZC4S2tXm16mYMdOKJPA',
        name: 'Silver',
        gender: 'male',
        duration: 365, // days
        price: 120,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DeuC4S2tXm16mGEktPJHl',
        name: 'Silver',
        gender: 'male',
        duration: 90, // days
        price: 60,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DfCC4S2tXm16mj2bRczaX',
        name: 'Silver',
        gender: 'male',
        duration: 30, // days
        price: 30,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DfkC4S2tXm16mNL33vcmi',
        name: 'Gold',
        gender: 'female',
        duration: 365, // days
        price: 84,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9Dg1C4S2tXm16m5Db3L8lL',
        name: 'Gold',
        gender: 'female',
        duration: 90, // days
        price: 39,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DgGC4S2tXm16m4hAuYDU0',
        name: 'Gold',
        gender: 'female',
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
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1NiKokC4S2tXm16mCpS4Fq0E',
        name: 'Gold',
        gender: 'male',
        duration: 365, // days
        price: 900,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6nEC4S2tXm16maiidI9kw',
        name: 'Gold',
        gender: 'male',
        duration: 90, // days
        price: 90,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6lwC4S2tXm16m67nUu76U',
        name: 'Gold',
        gender: 'male',
        duration: 30, // days
        price: 150,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6kuC4S2tXm16mgdyKtm1G',
        name: 'Silver',
        gender: 'male',
        duration: 365, // days
        price: 120,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6jxC4S2tXm16mseCfcUpz',
        name: 'Silver',
        gender: 'male',
        duration: 90, // days
        price: 281,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6iSC4S2tXm16mmf0vfGxD',
        name: 'Silver',
        gender: 'male',
        duration: 30, // days
        price: 113,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6dHC4S2tXm16moss57UOr',
        name: 'Gold',
        gender: 'female',
        duration: 365, // days
        price: 315,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1OG6bwC4S2tXm16mBdjRhQYs',
        name: 'Gold',
        gender: 'female',
        duration: 90, // days
        price: 146,
        status: true,
        currency:'sar',
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
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 'price_1N9DgGC4S2tXm16m4hAuYDU0',
        name: 'Gold',
        gender: 'female',
        duration: 30, // days
        price: 75,
        status: true,
        currency:'sar',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: null,
        name: 'Regular',
        gender: 'male',
        duration: null, // days
        price: null,
        status: true,
        currency:'usd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: null,
        name: 'Regular',
        gender: 'female',
        currency:'usd',
        duration: null, // days
        price: null,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: null,
        name: 'Regular',
        gender: 'male',
        duration: null, // days
        price: null,
        status: true,
        currency:'sar',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: null,
        name: 'Regular',
        gender: 'female',
        currency:'sar',
        duration: null, // days
        price: null,
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
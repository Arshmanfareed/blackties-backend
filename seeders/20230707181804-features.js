'use strict';
const { featureValidity, featureTypes } = require('../config/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Features', [
      {
        name: 'Edit your description',
        gender: 'male',
        price: 10,
        isForPurchase: true,
        featureType: featureTypes.EDIT_DESCRIPTION,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Request extra information',
        gender: 'male',
        price: 30,
        isForPurchase: true,
        featureType: featureTypes.EXTRA_INFORMATION_REQUEST,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Request extra information',
        gender: 'male',
        price: 10,
        isForPurchase: true,
        featureType: featureTypes.EXTRA_INFORMATION_REQUEST,
        validityType: featureValidity.COUNT,
        count: 100,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Request extra information',
        gender: 'male',
        price: 5,
        isForPurchase: true,
        featureType: featureTypes.EXTRA_INFORMATION_REQUEST,
        validityType: featureValidity.COUNT,
        count: 50,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Contact details requests',
        gender: 'male',
        price: 30,
        isForPurchase: true,
        featureType: featureTypes.CONTACT_DETAILS_REQUEST,
        validityType: featureValidity.COUNT,
        count: 10,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Contact details requests',
        gender: 'male',
        price: 5,
        isForPurchase: true,
        featureType: featureTypes.CONTACT_DETAILS_REQUEST,
        validityType: featureValidity.COUNT,
        count: 1,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'See who viewed my profile',
        gender: 'both',
        price: 5,
        isForPurchase: true,
        featureType: featureTypes.SEE_WHO_VIEWED_MY_PROFILE,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Answer questions',
        gender: 'male',
        price: 10,
        isForPurchase: true,
        featureType: featureTypes.ANSWER_QUESTION,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'See who saved my profile',
        gender: 'female',
        price: 10,
        isForPurchase: true,
        featureType: featureTypes.SEE_WHO_SAVED_MY_PROFILE,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Request picture',
        gender: 'female',
        price: 30,
        isForPurchase: true,
        featureType: featureTypes.PICTURE_REQUEST,
        validityType: featureValidity.LIFETIME,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Request picture',
        gender: 'female',
        price: 15,
        isForPurchase: true,
        featureType: featureTypes.PICTURE_REQUEST,
        validityType: featureValidity.COUNT,
        count: 25,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // for unlock reward
        name: 'Answer questions',
        gender: 'male',
        price: null,
        isForPurchase: false,
        featureType: featureTypes.ANSWER_QUESTION,
        validityType: featureValidity.DAYS,
        count: null,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Features', null, {});
  },
}

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SubscriptionFeatures', [
      {
        id: 1,
        subscriptionPlanId: 1,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        subscriptionPlanId: 1,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        subscriptionPlanId: 2,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        subscriptionPlanId: 2,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        subscriptionPlanId: 3,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        subscriptionPlanId: 3,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        subscriptionPlanId: 4,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        subscriptionPlanId: 4,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        subscriptionPlanId: 5,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        subscriptionPlanId: 5,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        subscriptionPlanId: 6,
        featureName: 'Extra visibility',
        featureType: 'EXTRA_VISIBILITY',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        subscriptionPlanId: 6,
        featureName: 'Request pictures',
        featureType: 'PICTURE_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      //Silver Male 
      {
        id: 13,
        subscriptionPlanId: 7,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        subscriptionPlanId: 7,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        subscriptionPlanId: 7,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        subscriptionPlanId: 7,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 5
      {
        id: 17,
        subscriptionPlanId: 8,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        subscriptionPlanId: 8,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 19,
        subscriptionPlanId: 8,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        subscriptionPlanId: 8,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 
      {
        id: 21,
        subscriptionPlanId: 9,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        subscriptionPlanId: 9,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 23,
        subscriptionPlanId: 9,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 24,
        subscriptionPlanId: 9,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 
      {
        id: 25,
        subscriptionPlanId: 10,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 26,
        subscriptionPlanId: 10,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 27,
        subscriptionPlanId: 10,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 28,
        subscriptionPlanId: 10,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 
      {
        id: 29,
        subscriptionPlanId: 11,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 30,
        subscriptionPlanId: 11,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 31,
        subscriptionPlanId: 11,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 32,
        subscriptionPlanId: 11,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 
      {
        id: 33,
        subscriptionPlanId: 12,
        featureName: 'Request contact details',
        featureType: 'CONTACT_DETAILS_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 34,
        subscriptionPlanId: 12,
        featureName: 'Answer questions',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 35,
        subscriptionPlanId: 12,
        featureName: 'Request extra information',
        featureType: 'EXTRA_INFORMATION_REQUEST',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 36,
        subscriptionPlanId: 12,
        featureName: 'Edit your description',
        featureType: 'EDIT_DESCRIPTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Regular Male

      {
        id: 40,
        subscriptionPlanId: 19,
        featureName: 'Answer questions (time-limited)',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 41,
        subscriptionPlanId: 19,
        featureName: 'Save profiles of interest',
        featureType: 'SAVE_PROFILE',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 42,
        subscriptionPlanId: 19,
        featureName: 'Advertize your information',
        featureType: 'ADVERTISE_INFO',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 
      {
        id: 37,
        subscriptionPlanId: 21,
        featureName: 'Answer questions (time-limited)',
        featureType: 'ANSWER_QUESTION',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 38,
        subscriptionPlanId: 21,
        featureName: 'Save profiles of interest',
        featureType: 'SAVE_PROFILE',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 39,
        subscriptionPlanId: 21,
        featureName: 'Advertize your information',
        featureType: 'ADVERTISE_INFO',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Gold Female

      {
        id: 43,
        subscriptionPlanId: 13,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 44,
        subscriptionPlanId: 13,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 45,
        subscriptionPlanId: 13,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 46,
        subscriptionPlanId: 13,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 

      {
        id: 47,
        subscriptionPlanId: 14,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 48,
        subscriptionPlanId: 14,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 49,
        subscriptionPlanId: 14,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 50,
        subscriptionPlanId: 14,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 

      {
        id: 51,
        subscriptionPlanId: 15,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 52,
        subscriptionPlanId: 15,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 53,
        subscriptionPlanId: 15,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 54,
        subscriptionPlanId: 15,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 

      {
        id: 55,
        subscriptionPlanId: 16,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 56,
        subscriptionPlanId: 16,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 57,
        subscriptionPlanId: 16,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 58,
        subscriptionPlanId: 16,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 

      {
        id: 59,
        subscriptionPlanId: 17,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 60,
        subscriptionPlanId: 17,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 61,
        subscriptionPlanId: 17,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 62,
        subscriptionPlanId: 17,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // 

      {
        id: 63,
        subscriptionPlanId: 18,
        featureName: "See who saved my profile",
        featureType: "SEE_WHO_SAVED_MY_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 64,
        subscriptionPlanId: 18,
        featureName: "Send contact details spontaneously",
        featureType: "CONTACT_DETAILS_SENT",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 65,
        subscriptionPlanId: 18,
        featureName: "Extra visibility",
        featureType: "EXTRA_VISIBILITY",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 66,
        subscriptionPlanId: 18,
        featureName: "Request picture",
        featureType: "PICTURE_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Regular female

      {
        id: 67,
        subscriptionPlanId: 20,
        featureName: "Answer questions (unlimited)",
        featureType: "ANSWER_QUESTION",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 68,
        subscriptionPlanId: 20,
        featureName: "Request extra information",
        featureType: "EXTRA_INFORMATION_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 69,
        subscriptionPlanId: 20,
        featureName: "Save profiles of interest",
        featureType: "SAVE_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 70,
        subscriptionPlanId: 20,
        featureName: "Edit your description",
        featureType: "EDIT_DESCRIPTION",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 71,
        subscriptionPlanId: 20,
        featureName: "Advertize your information",
        featureType: "ADVERTISE_INFO",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // 

      {
        id: 72,
        subscriptionPlanId: 22,
        featureName: "Answer questions (unlimited)",
        featureType: "ANSWER_QUESTION",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 73,
        subscriptionPlanId: 22,
        featureName: "Request extra information",
        featureType: "EXTRA_INFORMATION_REQUEST",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 74,
        subscriptionPlanId: 22,
        featureName: "Save profiles of interest",
        featureType: "SAVE_PROFILE",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 75,
        subscriptionPlanId: 22,
        featureName: "Edit your description",
        featureType: "EDIT_DESCRIPTION",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 76,
        subscriptionPlanId: 22,
        featureName: "Advertize your information",
        featureType: "ADVERTISE_INFO",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SubscriptionFeatures', null, {});
  }
};

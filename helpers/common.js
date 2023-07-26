const db = require('../models')
const { featureTypes, featureValidity } = require('../config/constants')
const moment = require('moment')

module.exports = {
  insertOrUpdateReward: async (userId, rewardType, noOfDays) => {
    // give reward 2 days of answer
    await db.RewardHistory.create({ userId, rewardType, isPending: false, status: true })
    // Find the user's feature where validityType is 'DAYS' and featureType is 'ANSWER_QUESTION'
    const userFeature = await db.UserFeature.findOne({
      where: {
        userId,
        featureType: featureTypes.ANSWER_QUESTION,
        validityType: featureValidity.DAYS,
      },
    });
    const today = new Date();
    const daysInMilliseconds = noOfDays * 24 * 60 * 60 * 1000;
    let updatedExpiry = new Date()
    if (userFeature.expiryDate >= new Date()) {
      updatedExpiry = moment(userFeature.expiryDate).clone().add(noOfDays, 'days');  // Add 2 days to the expiry date
    } else {
      updatedExpiry = new Date(today.getTime() + daysInMilliseconds); // Add 2 days to the current date
    }
    // Update the database with the new expiry date and status
    await db.UserFeature.update({
      expiryDate: updatedExpiry,
      status: 1
    }, {
      where: {
        userId,
        featureType: featureTypes.ANSWER_QUESTION,
        validityType: featureValidity.DAYS,
      }
    })
  }
}
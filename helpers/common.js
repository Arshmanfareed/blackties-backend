const db = require('../models')
const { featureTypes, featureValidity } = require('../config/constants')
const moment = require('moment')
const { Op, Sequelize } = require('sequelize')

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
  },
  getUserCountsBasedOnLastLogin: async () => {
    const now = new Date();
    const intervals = [
      { label: '12 Months', interval: 12, unit: 'month' },
      { label: '6 Months', interval: 6, unit: 'month' },
      { label: '3 Months', interval: 3, unit: 'month' },
      { label: '1 Month', interval: 1, unit: 'month' },
      { label: '7 Days', interval: 7, unit: 'day' },
      { label: '3 Days', interval: 3, unit: 'day' },
      { label: '1 Day', interval: 1, unit: 'day' },
    ];
    let intervalCounts = await Promise.allSettled(
      intervals.map(async interval => {
        const dateLimit = new Date(now);
        if (interval.unit === 'month') {
          dateLimit.setMonth(dateLimit.getMonth() - interval.interval);
        } else if (interval.unit === 'day') {
          dateLimit.setDate(dateLimit.getDate() - interval.interval);
        }
        const count = await db.User.count({
          where: {
            lastLogin: { [Op.gte]: dateLimit },
          },
        });

        return { interval: interval.label, count };
      })
    );
    intervalCounts = intervalCounts.map(item => item.value)
    return intervalCounts
  },
  getUserAttributes: async (userId, attributesList) => {
    return db.User.findOne({ where: { id: userId }, attributes: attributesList })
  },
  fetchUserProfileStats: async (userId, startDate, endDate) => {
    try {
      // X users saw your profile
      let profileViews = await db.UserSeen.count({
        where: {
          viewedId: userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
      })
      
      // X users saved your profile
      let profilesSavedCount = await db.SavedProfile.count({
        where: {
          savedUserId: userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
      })
      // X users have asked you questions
      let extraInfoRequestCount = await db.ExtraInfoRequest.count({
        where: {
          requesteeUserId: userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      })
      // X users requested your contact detais
      let contactDetailsRequestCount = await db.ContactDetailsRequest.count({
        where: {
          requesteeUserId: userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      })  
      
      return {
        userId,
        profileViews,
        profilesSavedCount,
        extraInfoRequestCount,
        contactDetailsRequestCount
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const { sequelize } = require('../models')
const db = require('../models')
const { Op, Sequelize, QueryTypes } = require('sequelize')
const sendMail = require('../utils/send-mail')
const { gender, rewardPurpose, featureTypes, featureValidity } = require('../config/constants')
const moment = require('moment')
const common = require('./common')

const helperFunctions = {
  sendAccountActivationLink: async (email, userId, activationCode) => {
    // const activationLink = process.env.PAGES_LINK + "accountActivation.html?userId=" + userId + "&code=" + activationCode
    const activationLink = process.env.BASE_URL_DEV + "/auth/account-activation/" + userId + "/" + activationCode
    const emailBody = `
      Please click on this link to activate your account ${activationLink}
    `
    sendMail(email, "Email Verification Link", emailBody)
  },
  generateUserCode: async (sex) => {
    const lastUser = await db.User.count({
      include: {
        model: db.Profile,
        where: {
          sex
        },
      },
    })
    const userCode = sex == gender.MALE ? 'M' + (Number(lastUser + 1)) : 'F' + (Number(lastUser + 1));
    return userCode
  },
  createMatchIfNotExist: async (requesterUserId, requesteeUserId, t) => {
    const matchExist = await db.Match.findOne({
      where: {
        [Op.or]: [
          { userId: requesterUserId, otherUserId: requesteeUserId }, // either match b/w user1 or user2
          { userId: requesteeUserId, otherUserId: requesterUserId }, // or match b/w user2 or user1
        ],
        // isCancelled: false
      }
    })
    if (!matchExist) {
      await db.Match.create({ userId: requesterUserId, otherUserId: requesteeUserId, status: true }, { transaction: t })
    } else if (matchExist.isCancelled) {
      await db.Match.update({ isCancelled: false, cancelledBy: null }, { where: { id: matchExist.id }, transaction: t })
    }
    return true
  },
  getUserProfile: async (userId) => {
    return db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Profile
        },
        {
          model: db.UserLanguage
        },
        {
          model: db.UserSetting,
          attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }
        },
      ]
    })
  },
  createUserFeature: async (userId, featureId, featureType, validityType, expiryDate, remaining, t) => {
    return db.UserFeature.create({
      userId,
      featureId,
      featureType,
      validityType,
      expiryDate,
      remaining,
      status: 1,
    }, { transaction: t })
  },
  giveEmailVerifyReward: async (userId) => {
    // check if reward not already given (unlock 2 days of answer)
    const rewaredGranted = await db.RewardHistory.findOne({ where: { userId, rewardType: rewardPurpose.EMAIL_VERIFIED } })
    if (!rewaredGranted || rewaredGranted.isPending) {
      // give 2 days of answer
      await db.RewardHistory.create({ userId, rewardType: rewardPurpose.EMAIL_VERIFIED, isPending: false, status: true })
      const feature = await db.Feature.findOne({
        where: {
          featureType: featureTypes.ANSWER_QUESTION,
          validityType: featureValidity.DAYS,
        }
      })
      // check for other pending rewards
      const pendingRewards = await db.RewardHistory.findAll({
        where: {
          userId,
          isPending: true
        }
      })
      let noOfDays = 2; // email verify reward initially
      for (const pendingReward of pendingRewards) {
        switch (pendingReward.rewardType) {
          case rewardPurpose.PHONE_VERIFIED:
            noOfDays += 2
            break
          case rewardPurpose.FILLED_ALL_INFO:
            noOfDays += 1
            break
          case rewardPurpose.DESCRIPTION_ADDED:
            noOfDays += 2
            break
          default:
            noOfDays += 0
            break
        }
      }
      await db.RewardHistory.update({ isPending: false }, { where: { userId, isPending: true } })
      // assign reward
      await db.UserFeature.create({
        userId,
        featureId: feature.id,
        featureType: feature.featureType,
        validityType: featureValidity.DAYS,
        expiryDate: new Date(new Date().getTime() + (noOfDays * 24 * 60 * 60 * 1000)),
        status: 1
      })
    }
  },
  givePhoneVerifyReward: async (userId) => {
    // check if reward not already given (unlock 2 days of answer)
    const rewaredGranted = await db.RewardHistory.findOne({ where: { userId, rewardType: rewardPurpose.PHONE_VERIFIED } })
    if (!rewaredGranted) {
      const { isEmailVerified } = await db.UserSetting.findOne({ where: { userId } })
      if (isEmailVerified) {
        // if email verified then give reward 
        // give 2 days of answer
        await common.insertOrUpdateReward(userId, rewardPurpose.PHONE_VERIFIED, 2)
      } else {
        // if email not verified then hold this reward
        await db.RewardHistory.create({ userId, rewardType: rewardPurpose.PHONE_VERIFIED, isPending: true, status: true })
      }
    }
  },
  giveDescriptionAddedReward: async (userId) => {
    const rewaredGranted = await db.RewardHistory.findOne({ where: { userId, rewardType: rewardPurpose.DESCRIPTION_ADDED } })
    if (!rewaredGranted) { // check if reward already given
      const { isEmailVerified, isPhoneVerified } = await db.UserSetting.findOne({ where: { userId } })
      if (isEmailVerified && isPhoneVerified) { // and isFilledAllInfo
        await common.insertOrUpdateReward(userId, rewardPurpose.DESCRIPTION_ADDED, 2)
      } else {
        // if pre conditions do not meet then hold this reward
        await db.RewardHistory.create({ userId, rewardType: rewardPurpose.DESCRIPTION_ADDED, isPending: true, status: true })
      }
    }
  },
  giveAllInfoFilledReward: async (userId) => {
    const rewaredGranted = await db.RewardHistory.findOne({ where: { userId, rewardType: rewardPurpose.FILLED_ALL_INFO } })
    if (!rewaredGranted) { // check if reward already given
      const { isEmailVerified, isPhoneVerified } = await db.UserSetting.findOne({ where: { userId } })
      if (isEmailVerified && isPhoneVerified) {
        await common.insertOrUpdateReward(userId, rewardPurpose.FILLED_ALL_INFO, 1)
      } else {
        // if pre conditions do not meet then hold this reward
        await db.RewardHistory.create({ userId, rewardType: rewardPurpose.FILLED_ALL_INFO, isPending: true, status: true })
      }
    }
  },
}
module.exports = helperFunctions

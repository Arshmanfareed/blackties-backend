const { sequelize } = require('../models')
const db = require('../models')
const { Op, fn, col, Sequelize, QueryTypes } = require('sequelize')
const sendMail = require('../utils/sendgrid-mail')
const { gender, rewardPurpose, featureTypes, featureValidity, status, suspensionCriteria, requestStatus } = require('../config/constants')
const moment = require('moment')
const common = require('./common')

const helperFunctions = {
  sendAccountActivationLink: async (email, userId, activationCode, lang = 'en') => {
    const activationLink = process.env.BASE_URL_DEV + "/auth/account-activation/" + userId + "/" + activationCode
    const templatedId = process.env.EMAIL_VERIFY_TEMPLATE_ID
    const dynamicParams = {
      link: activationLink
    }
    sendMail(templatedId, email, 'Verification Link', dynamicParams)
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
    const userFeatures = await db.UserFeature.findAll({
      where: {
        userId,
        status: 1
      }
    })
    const userMatch = await db.Match.findOne({
      where: {
        [Op.or]: [
          { otherUserId: userId }, // either match b/w user1 or user2
          { userId: userId }, // either match b/w user1 or user2
         
        ],
        isCancelled: 0
        
      }
    })
    const userStruggling = await db.ContactDetailsRequest.findAll({
      where: {
        [Op.or]: [
          { requesteeUserId: userId }, // either match b/w user1 or user2
          { requesterUserId: userId }, // either match b/w user1 or user2
         
        ],
        status: requestStatus.STRUGGLING
        
      }
    })
    let user = await db.User.findOne({
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
        {
          model: db.LockedDescription,
          attributes: ['id', 'reason', 'duration', 'unlockDate', 'createdAt']
        }
      ]
    })

    
    user = JSON.parse(JSON.stringify(user))
    user['userFeatures'] = userFeatures
    user['userMatch'] = userMatch
    user['strugglingUsers'] = userStruggling
    return user
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
        // chech for pending reward in sequence
        const pendingRewardIds = []
        const filledAllInfoPendingReward = await db.RewardHistory.findOne({
          where: {
            userId,
            isPending: true,
            rewardType: rewardPurpose.FILLED_ALL_INFO
          }
        })
        let noOfDays = 2; // phone verify reward initially
        if (filledAllInfoPendingReward) {
          noOfDays += 1
          pendingRewardIds.push(filledAllInfoPendingReward.id) // pending reward 
          const addedDescriptionPendingReward = await db.RewardHistory.findOne({
            where: {
              userId,
              isPending: true,
              rewardType: rewardPurpose.DESCRIPTION_ADDED
            }
          })
          if (addedDescriptionPendingReward) {
            noOfDays += 2
            pendingRewardIds.push(addedDescriptionPendingReward.id) // pending reward 
          }
          await db.RewardHistory.update({ isPending: false }, { where: { id: pendingRewardIds } })
        }
        // give 2 days of answer
        await common.insertOrUpdateReward(userId, rewardPurpose.PHONE_VERIFIED, noOfDays)
      } else {
        // if email not verified then hold this reward
        await db.RewardHistory.create({ userId, rewardType: rewardPurpose.PHONE_VERIFIED, isPending: true, status: true })
      }
    }
  },
  giveDescriptionAddedReward: async (userId) => {
    const rewaredGranted = await db.RewardHistory.findOne({ where: { userId, rewardType: rewardPurpose.DESCRIPTION_ADDED } })
    if (!rewaredGranted) { // check if reward already given
      const { isEmailVerified, isPhoneVerified, isFilledAllInfo } = await db.UserSetting.findOne({ where: { userId } })
      if (isEmailVerified && isPhoneVerified && isFilledAllInfo) {
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
        // chech for pending reward in sequence
        const addedDescriptionPendingReward = await db.RewardHistory.findOne({
          where: {
            userId,
            isPending: true,
            rewardType: rewardPurpose.DESCRIPTION_ADDED
          }
        })
        let noOfDays = 1; // phone verify reward initially
        if (addedDescriptionPendingReward) {
          noOfDays += 2
          await db.RewardHistory.update({ isPending: false }, { where: { id: addedDescriptionPendingReward.id } })
        }
        await common.insertOrUpdateReward(userId, rewardPurpose.FILLED_ALL_INFO, noOfDays)
      } else {
        // if pre conditions do not meet then hold this reward
        await db.RewardHistory.create({ userId, rewardType: rewardPurpose.FILLED_ALL_INFO, isPending: true, status: true })
      }
    }
  },
  autoSuspendUserOnBlocks: async (blockedUserId, blockerUserId, blockerUserIpAddress) => {
    const t = await db.sequelize.transaction()
    try {
      /*
        If a user is blocked by 10 unique users in 30 days or blocked by 20 unique users in 90 days then
        it will be suspended but here are the rules 
        only first block of a verified user with a unique IP address will be counted.
        * Reason for block should not be 'Not Suitable for me' if multiple options are selected, block is counted.
        if this is the first time user will be banned/suspend for 1 month
        if second time user will be banned/suspend for 3 months
        if third time user will be banned/suspend for 6 months
        if fourth time user will be banned/suspend for indefinitely
      */


        const blockedUsers = await db.BlockedUser.findAll({
          attributes: [
            'id',
            'blockerUserId',
            'blockerUserIpAddress',
            'blockedUserId',
            [sequelize.literal('MIN(blockreasons.blockedId)'), 'blockedId'],
            [sequelize.literal('MIN(blockreasons.reason)'), 'reason'],
            [sequelize.literal('MIN(blockerUserSetting.userId)'), 'userId'],
            [sequelize.literal('MIN(blockerUserSetting.isEmailVerified)'), 'isEmailVerified'],
          ],
          include: [
            {
              model: db.BlockReason,
              attributes: [],
              where: {
                reason: {
                  [Op.ne]: 'not_suitable_for_me'
                }
              },
              required: false
            },
            {
              model: db.UserSetting,
              attributes: [],
              as: 'blockerUserSetting', // Correct alias
              where: {
                isEmailVerified: 1
              },
              required: false
            }
          ],
          where: {
            blockedUserId: blockedUserId,
            createdAt: {
              [Op.between]: [moment().subtract(30, 'days').utc(), moment().utc()]
            }
          },
          group: ['blockerUserIpAddress']
        });

        const blockedUsersFor90Days = await db.BlockedUser.findAll({
          attributes: [
            'id',
            'blockerUserId',
            'blockerUserIpAddress',
            'blockedUserId',
            [sequelize.literal('MIN(blockreasons.blockedId)'), 'blockedId'],
            [sequelize.literal('MIN(blockreasons.reason)'), 'reason'],
            [sequelize.literal('MIN(blockerUserSetting.userId)'), 'userId'],
            [sequelize.literal('MIN(blockerUserSetting.isEmailVerified)'), 'isEmailVerified'],
          ],
          include: [
            {
              model: db.BlockReason,
              attributes: [],
              where: {
                reason: {
                  [Op.ne]: 'not_suitable_for_me'
                }
              },
              required: false
            },
            {
              model: db.UserSetting,
              attributes: [],
              as: 'blockerUserSetting', // Correct alias
              where: {
                isEmailVerified: 1
              },
              required: false
            }
          ],
          where: {
            blockedUserId: 5,
            createdAt: {
              [Op.between]: [moment().subtract(90, 'days').utc(), moment().utc()]
            }
          },
          group: ['blockerUserIpAddress']
        });
                      
        const promisesResolved = await Promise.allSettled([
          db.BlockedUser.count({
            where: {
              blockedUserId,
              createdAt: {
                [Op.between]: [moment().subtract(30, 'days').utc(), moment().utc()]
              }
            },
            include: [{
              model: db.UserSetting,
              as: 'blockerUserSetting', // Specify the alias for the association
              where: {
                userId: blockerUserId,
              }
            }]
          }),
          db.BlockedUser.count({
            where: {
              blockedUserId,
              createdAt: {
                [Op.between]: [moment().subtract(90, 'days').utc(), moment().utc()]
              }
            },
            include: [{
              model: db.UserSetting,
              as: 'blockerUserSetting', // Specify the alias for the association
              where: {
                userId: blockerUserId,
                isEmailVerified: 1
              }
            }]
          }),
          db.User.findOne({
            where: { id: blockedUserId },
            attributes: ['status'],
            include: {
              model: db.UserSetting,
            }
          })
        ]);
        
        const userSetting = await db.UserSetting.findOne({
          where: { userId: blockedUserId },
          attributes: ['suspendCount'],
        })

      const blocksIn30Days = blockedUsers.length
      const blocksIn90Days = blockedUsersFor90Days.length
      const user = promisesResolved[2].status == 'fulfilled' ? promisesResolved[2].value : {}
      console.log('blocksIn30Days', blocksIn30Days);
      console.log('blocksIn90Days', blocksIn90Days);

      let suspendEndDate = null
      if (user?.status === status.ACTIVE && (blocksIn30Days >= 10 || blocksIn90Days >= 20)) {
        const { suspendCount: noOfTimesUserPreviouslySuspended } = user.UserSetting; // get it from user setting table
        let period = unit = null;
        if (noOfTimesUserPreviouslySuspended in suspensionCriteria) {
          ({ period, unit } = suspensionCriteria[noOfTimesUserPreviouslySuspended]);
          suspendEndDate = moment().add(period, unit)
        }
        if(userSetting.suspendCount != 3){
          console.log('ACTIVE');
          // suspend a user based on suspend period
          await db.User.update({ status: status.SUSPENDED }, { where: { id: blockedUserId }, transaction: t })
          await db.SuspendedUser.create({ userId: blockedUserId, reason: 'DUE_TO_BLOCKS', suspendEndDate, status: true, duration: period }, { transaction: t })
          // * increment no of times user banned due to block by users
          await db.UserSetting.increment('suspendCount', { by: 1, where: { userId: blockedUserId }, transaction: t })
        }else{
          console.log('deactivated');
          await db.User.update({ status: status.DEACTIVATED, email: 'email_deleted', phoneNo: '' }, { where: { id: blockedUserId }, transaction: t })
          await db.UserSetting.update({ isEmailVerified: 0, membership: 'Regular' }, { where: { userId: blockedUserId }, transaction: t })
          // await db.Match.destroy({ where: { userId: 5 }, transaction: t });
          await db.Match.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { userId: blockedUserId },
                      { otherUserId: blockedUserId }
                  ]
              }, 
              transaction: t 
          });
          await db.ContactDetailsRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: blockedUserId },
                      { requesteeUserId: blockedUserId }
                  ]
              }, 
              transaction: t 
          });
          await db.PictureRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: blockedUserId },
                      { requesteeUserId: blockedUserId }
                  ]
              }, 
              transaction: t 
          });
          await db.ExtraInfoRequest.destroy({ 
              where: { 
                  [db.Sequelize.Op.or]: [
                      { requesterUserId: blockedUserId },
                      { requesteeUserId: blockedUserId }
                  ]
              }, 
              transaction: t 
          });

        }
        
      }
      await t.commit()
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  checkForPushNotificationToggle: async (userId, otherUserId, toggleKey) => {
    try {
      const user = await db.User.findOne({
        attributes: [],
        where: { id: userId },
        include: [
          {
            model: db.Profile,
            attributes: ['sex', 'nationality'],
          },
          {
            model: db.NotificationSetting,
          }
        ]
      })
      const { sex } = user.Profile
      const notificationToggles = user.NotificationSetting
      if (sex === gender.MALE) { // male
        return notificationToggles[toggleKey] || false
      } else { // female
        if (notificationToggles.restrictPushNotificationOfMyNationality) {
          const otherUserProfile = await db.Profile.findOne({ where: { userId: otherUserId } })
          return user.Profile.nationality === otherUserProfile.nationality
        } else {
          return notificationToggles[toggleKey] || false
        }
      }
    } catch (error) {
      console.log(error)
      return false
    }
  },
}

module.exports = helperFunctions

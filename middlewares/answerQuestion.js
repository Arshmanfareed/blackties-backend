const responseFunctions = require('../utils/responses')
const db = require('../models')
const { gender, membership, featureTypes, featureValidity } = require('../config/constants');
const { Op } = require('sequelize')

async function handleMaleUser(req, res, next, userId) {
  const lifeTimeAnswerFeature = await db.UserFeature.findOne({
    where: {
      userId,
      featureType: featureTypes.ANSWER_QUESTION,
      validityType: featureValidity.LIFETIME
    }
  });

  if (lifeTimeAnswerFeature) {
    return next()
  }
  const timeLimitAnswerFeature = await db.UserFeature.findOne({
    where: {
      userId,
      featureType: featureTypes.ANSWER_QUESTION,
      status: 1,
      expiryDate: {
        [Op.gte]: new Date()
      }
    }
  });
  if (!timeLimitAnswerFeature) {
    throw new Error('You have to unlock answer question feature.')
  } else {
    return next()
  }
}

module.exports = async (req, res, next) => {
  try {
    const { id: userId } = req.user
    const user = await db.User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: db.Profile,
          attributes: ['sex']
        },
        {
          model: db.UserSetting,
          attributes: ['isPremium', 'membership']
        }
      ]
    })
    const { isPremium, membership: userMembership } = user.UserSetting
    const { sex } = user.Profile
    console.log(JSON.parse(JSON.stringify(user)))
    if (sex === gender.FEMALE) {
      next()
    } else if (sex === gender.MALE) {
      // check for membership
      if (isPremium && (userMembership === membership.GOLD || userMembership === membership.SILVER)) {
        return next()
      }
      // check for request extra information feature if unlocked
      await handleMaleUser(req, res, next, userId);
    }
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

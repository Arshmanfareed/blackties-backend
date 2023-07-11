const responseFunctions = require('../utils/responses')
const db = require('../models')
const { gender, membership, featureTypes, featureValidity } = require('../config/constants');

async function handleMaleUser(req, res, next, userId) {
  const userFeature = await db.UserFeature.findAll({
    where: {
      userId,
      featureType: featureTypes.EXTRA_INFORMATION_REQUEST,
    }
  });

  if (userFeature.length === 0) {
    throw new Error('You have to unlock request extra information feature.')
  }

  const lifeTimeFeature = userFeature.find(feat => feat.validityType === featureValidity.LIFETIME);
  const countBasedFeature = userFeature.find(feat => feat.validityType === featureValidity.COUNT);
  if (lifeTimeFeature || (countBasedFeature && countBasedFeature.remaining > 0)) {
    if (!lifeTimeFeature) {
      req.user.countBasedFeature = countBasedFeature
    }
    next();
  } else {
    throw new Error('You have to unlock request extra information feature.')
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

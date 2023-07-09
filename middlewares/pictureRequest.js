const responseFunctions = require('../utils/responses')
const db = require('../models')
const { gender, membership, featureTypes, featureValidity } = require('../config/constants');

async function handleFemaleUser(req, res, next, userId) {
  const userFeature = await db.UserFeature.findAll({
    where: {
      userId,
      featureType: featureTypes.PICTURE_REQUEST,
    }
  });

  if (userFeature.length === 0) {
    throw new Error('You have to unlock request picture feature.')
  }

  const lifeTimeFeature = userFeature.find(feat => feat.validityType === featureValidity.LIFETIME);
  const countBasedFeature = userFeature.find(feat => feat.validityType === featureValidity.COUNT);
  if (lifeTimeFeature || (countBasedFeature && countBasedFeature.remaining > 0)) {
    if (!lifeTimeFeature) {
      req.user.countBasedFeature = countBasedFeature
    }
    next();
  } else {
    throw new Error('You have to unlock request picture feature.')
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

    if (sex === gender.MALE) { // check for gold membership
      if (!(isPremium && userMembership === membership.GOLD)) {
        return responseFunctions._400(res, 'You need to be a gold member to request a picture.')
      }
      next()
    } else if (sex === gender.FEMALE) {
      // check for request picture feature if unlocked
      await handleFemaleUser(req, res, next, userId);
    }
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

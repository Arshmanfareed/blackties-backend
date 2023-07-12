const responseFunctions = require('../utils/responses')
const db = require('../models')
const { gender, membership, featureTypes } = require('../config/constants');

async function handleMaleUser(req, res, next, userId) {
  const userFeature = await db.UserFeature.findOne({
    where: {
      userId,
      featureType: featureTypes.CONTACT_DETAILS_REQUEST,
    }
  });

  if (!userFeature) {
    throw new Error('You have to unlock request contact details feature.')
  }

  if (userFeature.remaining > 0) {
    req.user.countBasedFeature = userFeature
    next()
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

    if (sex === gender.FEMALE) { // check for gold membership
      if (!(isPremium && userMembership === membership.GOLD)) {
        return responseFunctions._400(res, 'You need to be a gold member to send contact details.')
      }
      next()
    } else if (sex === gender.MALE) {
      // check for membership
      if (isPremium && (userMembership === membership.GOLD || userMembership === membership.SILVER)) {
        return next()
      }
      // check for request contact details feature if unlocked
      await handleMaleUser(req, res, next, userId);
    }
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

const responseFunctions = require('../utils/responses')
const db = require('../models')
const { featureTypes, gender, membership } = require('../config/constants');

module.exports = async (req, res, next) => {
  try {
    const { id: userId } = req.user
    const user = await db.User.findOne({
      attributes: [],
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
      if (!(isPremium && userMembership === membership.GOLD)) {
        const userFeature = await db.UserFeature.findOne({
          where: {
            userId,
            featureType: featureTypes.SEE_WHO_SAVED_MY_PROFILE,
          }
        })
        if (!userFeature) {
          return responseFunctions._400(res, `You need to unlock 'See who saved my profile feature.'`)
        }
      }
    }
    next()
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

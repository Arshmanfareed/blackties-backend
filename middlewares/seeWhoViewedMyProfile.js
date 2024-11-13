const responseFunctions = require('../utils/responses')
const db = require('../models')
const { featureTypes } = require('../config/constants');

module.exports = async (req, res, next) => {
  try {
    const { id: userId } = req.user
    const userFeature = await db.UserFeature.findOne({
      where: {
        userId,
        featureType: featureTypes.SEE_WHO_VIEWED_MY_PROFILE,
      }
    })
    if (!userFeature) {
      return responseFunctions._400(res, `You need to unlock 'See who viewed my profile' feature.`)
    }
    next()
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

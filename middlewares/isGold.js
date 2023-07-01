const responseFunctions = require('../utils/responses')
const db = require('../models')
const { GOLD } = require('../config/constants').membership

module.exports = async (req, res, next) => {
  try {
    const { id: userId } = req.user
    const { isPremium, membership } = await db.UserSetting.findOne({ where: { userId } })
    if (!isPremium && membership != GOLD) {
      return responseFunctions._400(res, 'You need to be a gold member to request a picture.')
    }
    next()
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

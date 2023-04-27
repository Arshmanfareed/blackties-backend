const responseFunctions = require('../utils/responses')
const db = require('../models')

module.exports = async function (req, res, next) {
  try {
    const { id: userId } = req.user
    const { isSubscribed } = await db.UserSetting.findOne({ where: { userId } })
    if (!isSubscribed) {
      return responseFunctions._400(res, 'You have to purchase a premium plan to view insights')
    }
    next()
  } catch (error) {
    return responseFunctions._400(res, error.message)
  }
}

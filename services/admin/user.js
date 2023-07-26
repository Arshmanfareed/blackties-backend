const db = require('../../models')
const { roles, status } = require("../../config/constants")

module.exports = {
  getActiveUsers: async (query) => {
    const { limit, offset } = query
    const whereOnUser = {
      role: roles.USER,
      status: status.ACTIVE
    }
    const count = await db.User.count({ where: whereOnUser })
    const users = await db.User.findAll({
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
      attributes: { exclude: ['password', 'otp', 'otpExpiry', 'tempEmail', 'socketId'] },
      where: whereOnUser,
      include: [
        {
          model: db.BlockedUser,
          as: 'blockedUser',
        }
      ]
    })
    return { count, users }
  },
}

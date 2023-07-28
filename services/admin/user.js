const db = require('../../models')
const { roles, status } = require("../../config/constants")
const { Op } = require('sequelize')
const moment = require('moment')

module.exports = {
  getUsers: async (query) => {
    const { limit, offset, search, status: queryStatus } = query
    const whereOnUser = {
      role: roles.USER,
      status: queryStatus || status.ACTIVE,
      username: { [Op.like]: search ? `%${search}%` : "%%" },
    }
    const includeTables = [
      {
        model: db.BlockedUser,
        as: 'blockedUser',
      },
    ]
    switch (queryStatus) {
      case status.DEACTIVATED:
        includeTables.push({
          model: db.DeactivatedUser,
          attributes: ['reason', 'feedback', 'createdAt']
        })
        break;
      case status.SUSPENDED:
        includeTables.push({
          model: db.SuspendedUser,
        })
        break;
      default:
        break;
    }
    const count = await db.User.count({ where: whereOnUser })
    const users = await db.User.findAll({
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
      attributes: { exclude: ['password', 'otp', 'otpExpiry', 'tempEmail', 'socketId'] },
      where: whereOnUser,
      include: includeTables
    })
    return { count, users }
  },
  suspendUser: async (userId, body) => {
    const t = await db.sequelize.transaction()
    try {
      const user = await db.User.findOne({ where: { id: userId } })
      if (user.status === status.SUSPENDED) {
        throw new Error('User already suspended.')
      }
      const { duration, reason } = body
      await db.User.update({ status: status.SUSPENDED }, { where: { id: userId }, transaction: t })
      let suspendEndDate = null
      if (duration) {
        suspendEndDate = moment().add(duration, 'M')
      }
      await db.SuspendedUser.create({ userId, reason, suspendEndDate }, { transaction: t })
      await t.commit()
      // socket event to logout user automatically
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
}

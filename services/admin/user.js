const db = require('../../models')
const { roles, status } = require("../../config/constants")
const { Op } = require('sequelize')
const moment = require('moment')
const bcryptjs = require("bcryptjs")

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
      await db.SuspendedUser.create({ userId, reason, suspendEndDate, status: true, duration }, { transaction: t })
      await t.commit()
      // socket event to logout user automatically
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  unsuspendUser: async (userId) => {
    const t = await db.sequelize.transaction()
    try {
      await db.User.update({ status: status.ACTIVE }, { where: { id: userId }, transaction: t })
      await db.SuspendedUser.destroy({ where: { userId }, transaction: t })
      await t.commit()
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  createSubAdmin: async (email) => {
    const emailExist = await db.User.findOne({ where: { email: email.toLowerCase() } })
    if (emailExist) {
      throw new Error('Email already in use.')
    }
    const salt = await bcryptjs.genSalt(10);
    const randomPassword = await bcryptjs.hash(Math.random().toString(36).slice(-8), salt)
    await db.User.create({
      email,
      username: email.split('@')[0],
      role: roles.SUB_ADMIN,
      password: randomPassword,
      status: status.ACTIVE,
    })
    // send email for resetting password
    return true
  },
  deleteAndLockDescription: async (userId, body) => {
    const t = await db.sequelize.transaction()
    try {
      const { duration, reason } = body
      let unlockDate = moment().add(14, 'days')
      if (duration) {
        unlockDate = moment().add(duration, 'M')
      }
      await db.LockedDescription.create({ userId, reason, unlockDate, duration, status: true }, { transaction: t })
      await db.Profile.update({ description: null }, { where: { userId }, transaction: t })
      await t.commit()
      // socket event to show red bar on user profile automatically
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
}

const db = require('../../models')
const { roles, status, gender } = require("../../config/constants")
const { Op, Sequelize } = require('sequelize')
const moment = require('moment')
const bcryptjs = require("bcryptjs")

module.exports = {
  getUsers: async (query) => {
    const { limit, offset, search, status: queryStatus, usernameOrCode } = query
    const usernameOrCodeQuery = usernameOrCode ? `%${usernameOrCode}%` : "%%";
    const whereOnUser = {
      role: roles.USER,
      status: queryStatus || status.ACTIVE,
      [Op.or]: {
        username: { [Op.like]: usernameOrCodeQuery },
        code: { [Op.like]: usernameOrCodeQuery },
      },
    }
    const includeTables = [
      {
        model: db.BlockedUser,
        as: 'blockedUser',
      },
      {
        model: db.UserSetting,
      },
      {
        model: db.Profile,
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
  lockDescription: async (userId, body) => {
    // const t = await db.sequelize.transaction()
    try {
      const { duration, reason } = body
      let unlockDate = null
      if (duration) {
        unlockDate = moment().add(duration, 'days')
      }
      await db.LockedDescription.create({ userId, reason, unlockDate, duration, status: true }/* , { transaction: t } */)
      // await db.Profile.update({ description: null }, { where: { userId }, transaction: t })
      // await t.commit()
      // socket event to show red bar on user profile automatically
      return true
    } catch (error) {
      console.log(error)
      // await t.rollback()
      throw new Error(error.message)
    }
  },
  unlockDescription: async (userId) => {
    // socket event to enable edit description option on user side
    return db.LockedDescription.destroy({ where: { userId } })
  },
  deleteDescription: async (userId) => {
    await db.Profile.update({ description: null }, { where: { userId } })
    // socket event to delete/hide description of the user
    return true
  },
  addCreditInUserWallet: async (userId, amount) => {
    const t = await db.sequelize.transaction()
    try {
      await db.Wallet.increment('amount', { by: amount, where: { userId }, transaction: t })
      await db.Transaction.create({ userId, amount, type: 'TOPUP_BY_ADMIN', status: true }, { transaction: t })
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw new Error(error.message)
    }
  },
  editUsername: async (userId, body) => {
    const { username } = body
    return db.User.update({ username }, { where: { id: userId } })
  },
  getUserDetails: async (userId) => {
    const dateBefore90DayFromToday = moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss');
    return db.User.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'username',
        'email',
        'status',
        'createdAt',
        'language',
        'code',
        'phoneNo',
        [Sequelize.literal(`(select COUNT(id) from BlockedUsers where blockedUserId = User.id and createdAt >= '${dateBefore90DayFromToday}' )`), 'noOfBlocksReceived'],
      ],
      include: [
        {
          model: db.UserSetting,
        },
        {
          model: db.Profile,
        },
        {
          model: db.Wallet,
        },
        {
          model: db.DeactivatedUser,
        },
        {
          model: db.SuspendedUser,
        },
        {
          model: db.LockedDescription,
        },
      ],
    })
  },
  getCounters: async () => {
    const accountsCreated = await db.Profile.count({
      group: ['sex']
    })
    const totalAccountsCreated = accountsCreated[0].count + accountsCreated[1].count
    const malesAccountCreated = accountsCreated.filter(item => item.sex === gender.MALE)[0]?.count || 0
    const femalesAccountCreated = accountsCreated.filter(item => item.sex === gender.FEMALE)[0]?.count || 0
    const deactivatedAccounts = await db.User.count({
      where: { status: status.DEACTIVATED }
    })
    const activeAccounts = await db.User.count({
      where: { status: status.ACTIVE, role: roles.USER },
      include: {
        model: db.Profile,
        attributes: ['sex']
      },
      group: [db.sequelize.col('Profile.sex')],
    })
    const totalActiveAccounts = activeAccounts[0].count + activeAccounts[1].count
    const maleActiveAccounts = activeAccounts.filter(item => item.sex === gender.MALE)[0]?.count || 0
    const femaleActiveAccounts = activeAccounts.filter(item => item.sex === gender.FEMALE)[0]?.count || 0
    const userMembership = await db.UserSetting.count({
      group: ['membership']
    })
    const counters = {
      accountsCreated: totalAccountsCreated,
      malesAccountCreated,
      femalesAccountCreated,
      deactivatedAccounts: deactivatedAccounts,
      totalActiveAccounts,
      maleActiveAccounts,
      femaleActiveAccounts,
      userMembership
    }
    return counters
  }
}

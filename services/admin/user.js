const db = require('../../models')
const { roles, status, gender } = require('../../config/constants')
const { Op, Sequelize } = require('sequelize')
const moment = require('moment')
const bcryptjs = require('bcryptjs')
const common = require('../../helpers/common')

module.exports = {
  getUsers: async (query) => {
    const {
      limit,
      offset,
      search,
      status: queryStatus,
      usernameOrCode,
      gender,
      memberShipStatus,
      nationality,
      country,
      city,
      height,
      weight,
      religiousity,
      work,
      education,
      ethnicity,
      tribe,
      financialStatus,
      healthStatus,
      language,
    } = query
    const usernameOrCodeQuery = usernameOrCode ? `%${usernameOrCode}%` : '%%'
    let whereOnUser = {
      role: roles.USER,
      [Op.or]: {
        username: { [Op.like]: usernameOrCodeQuery },
        code: { [Op.like]: usernameOrCodeQuery },
      },
    }

    // User profile where clause

    let whereOnUserProfile = {}
    if (gender) {
      whereOnUserProfile['sex'] = ['female']
    }
    if (nationality) {
      whereOnUserProfile['nationality'] = nationality
    }
    if (country) {
      whereOnUserProfile['country'] = country
    }
    if (city) {
      whereOnUserProfile['city'] = city
    }
    if (height) {
      whereOnUserProfile['height'] = height
    }
    if (weight) {
      whereOnUserProfile['weight'] = weight
    }
    if (religiousity) {
      whereOnUserProfile['religiousity'] = religiousity
    }
    if (work) {
      whereOnUserProfile['work'] = work
    }
    if (education) {
      whereOnUserProfile['education'] = education
    }
    if (ethnicity) {
      whereOnUserProfile['ethnicity'] = ethnicity
    }
    if (tribe) {
      whereOnUserProfile['tribe'] = tribe
    }
    if (financialStatus) {
      whereOnUserProfile['financialStatus'] = financialStatus
    }
    if (healthStatus) {
      whereOnUserProfile['healthStatus'] = healthStatus
    }

    // User setting where clause

    let whereOnUserSettings = {}
    if (memberShipStatus) {
      whereOnUserSettings['membership'] = memberShipStatus
    }
    if (language) {
      whereOnUserSettings['language'] = language
    }

    // User where clause

    if (queryStatus) {
      whereOnUser['status'] = queryStatus
    }

    const includeTables = [
      {
        model: db.BlockedUser,
        as: 'blockedUser',
      },
      {
        model: db.UserSetting,
        as: 'UserSetting',
      },
      {
        model: db.Profile,
        as: 'Profile',
      },
    ]
    if (Object.keys(whereOnUserProfile).length > 0) {
      includeTables.filter((el) => el.as === 'Profile')[0].where =
        whereOnUserProfile
    }
    if (Object.keys(whereOnUserSettings).length > 0) {
      includeTables.filter((el) => el.as === 'UserSetting')[0].where =
        whereOnUserSettings
    }
    switch (queryStatus) {
      case status.DEACTIVATED:
        includeTables.push({
          model: db.DeactivatedUser,
          attributes: ['reason', 'feedback', 'createdAt'],
        })
        break
      case status.SUSPENDED:
        includeTables.push({
          model: db.SuspendedUser,
        })
        break
      default:
        break
    }
    const count = await db.User.count({
      include: includeTables,
      where: whereOnUser,
      distinct: true,
    })
    const users = await db.User.findAll({
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
      attributes: {
        exclude: ['password', 'otp', 'otpExpiry', 'tempEmail', 'socketId'],
      },
      where: whereOnUser,
      include: includeTables,
    })
    return { count, users }
  },
  listAllUsers: async (body, query) => {
    const {
      search,
      status: queryStatus,
      usernameOrCode,
      gender,
      age,
      memberShipStatus,
      nationality,
      country,
      city,
      height,
      weight,
      religiousity,
      work,
      education,
      ethnicity,
      tribe,
      financialStatus,
      healthStatus,
      language,
    } = body

    const { limit, offset, date } = query


    const usernameOrCodeQuery = usernameOrCode ? `%${usernameOrCode}%` : '%%'

    let whereOnUser = {
      role: roles.USER,
      ...(date ? {
        [Op.and]: [
          // db.Sequelize.where(
          //   db.Sequelize.fn('date', db.Sequelize.col('User.createdAt')),
          //   '>=',
          //   date
          // ),
          db.Sequelize.where(
            db.Sequelize.fn('date', db.Sequelize.col('User.createdAt')),
            '<=',
            date
          ),
        ]
      } : {}),
      [Op.or]: {
        username: { [Op.like]: usernameOrCodeQuery },
        code: { [Op.like]: usernameOrCodeQuery },
      },
    };
    

    // if (date && date.length > 0) {
    //   whereOnUser[] = [
    //     db.Sequelize.where(
    //       db.Sequelize.fn('date', db.Sequelize.col('createdAt')),
    //       '>=',
    //       date
    //     ),
    //     db.Sequelize.where(
    //       db.Sequelize.fn('date', db.Sequelize.col('createdAt')),
    //       '<=',
    //       date
    //     ),
    //   ]
    // }

    // User profile where clause

    let whereOnUserProfile = {}
    if (gender && gender.length > 0) {
      whereOnUserProfile['sex'] = gender
    }
    if (nationality && nationality.length > 0) {
      whereOnUserProfile['nationality'] = nationality
    }
    if (country && country.length > 0) {
      whereOnUserProfile['country'] = country
    }
    if (city && city.length > 0) {
      whereOnUserProfile['city'] = city
    }
    if (height && height.length > 0) {
      whereOnUserProfile['height'] = {
        [Op.between]: [height[0], height[1]],
      }
    }
    if (weight && weight.length > 0) {
      whereOnUserProfile['weight'] = {
        [Op.between]: [weight[0], weight[1]],
      }
    }
    if (religiousity && religiousity.length > 0) {
      whereOnUserProfile['religiousity'] = religiousity
    }
    if (work && work.length > 0) {
      whereOnUserProfile['work'] = work
    }
    if (education && education.length > 0) {
      whereOnUserProfile['education'] = education
    }
    if (ethnicity && ethnicity.length > 0) {
      whereOnUserProfile['ethnicity'] = ethnicity
    }
    if (tribe && tribe.length > 0) {
      whereOnUserProfile['tribe'] = tribe
    }
    if (financialStatus && financialStatus.length > 0) {
      whereOnUserProfile['financialStatus'] = financialStatus
    }
    if (healthStatus && healthStatus.length > 0) {
      whereOnUserProfile['healthStatus'] = healthStatus
    }

    // User setting where clause

    let whereOnUserSettings = {}
    if (memberShipStatus && memberShipStatus.length > 0) {
      whereOnUserSettings['membership'] = memberShipStatus
    }
    if (language && language.length > 0) {
      whereOnUserSettings['language'] = language
    }

    // User where clause

    if (queryStatus && queryStatus.length > 0) {
      whereOnUser['status'] = queryStatus
    }

    const includeTables = [
      {
        model: db.BlockedUser,
        as: 'blockedUser',
       
      },
      {
        model: db.UserSetting,
        as: 'UserSetting',
       
      },
      {
        model: db.Profile,
        as: 'Profile',
       
      },
    ]
    if (Object.keys(whereOnUserProfile).length > 0 || (age && age.length > 0)) {
      includeTables.filter((el) => el.as === 'Profile')[0].where =
        whereOnUserProfile
    }
    if (Object.keys(whereOnUserSettings).length > 0) {
      includeTables.filter((el) => el.as === 'UserSetting')[0].where =
        whereOnUserSettings
    }
    switch (queryStatus) {
      case status.DEACTIVATED:
        includeTables.push({
          model: db.DeactivatedUser,
          attributes: ['reason', 'feedback', 'createdAt'],
        })
        break
      case status.SUSPENDED:
        includeTables.push({
          model: db.SuspendedUser,
        })
        break
      default:
        break
    }
    const today = new Date()

    let userAttributesToSelect = [
      'id',
      'email',
      'username',
      'status',
      'createdAt',
      'code',
      [
        Sequelize.literal(
          `TIMESTAMPDIFF(YEAR, dateOfBirth, '${today.toISOString()}')`
        ),
        'age',
      ]
    ]

    // if (age && age.length > 0) {
    //   userAttributesToSelect.push()
    // }

    const count = await db.User.count({
      include: date && date.length > 0 ? [] : includeTables,
      where: whereOnUser,
      distinct: true,
    })
    const users = await db.User.findAll({
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
      attributes: {
        exclude: ['password', 'otp', 'otpExpiry', 'tempEmail', 'socketId'],
      },
      where: whereOnUser,
      include: includeTables,
      attributes: userAttributesToSelect,
      having:
        age && age.length > 0
          ? {
              age: {
                [Op.gte]: age[0],
                [Op.lte]: age[1],
              },
            }
          : {},
    })
    return { count, users }
  },
  suspendUser: async (userId, body) => {
    const t = await db.sequelize.transaction()
    try {
      const user = await db.User.findOne({ where: { id: userId } })
      // if (user.status === status.SUSPENDED) {
      //   throw new Error('User already suspended.')
      // }
      const { duration, reason } = body
      await db.User.update(
        { status: status.SUSPENDED },
        { where: { id: userId }, transaction: t }
      )
      let suspendEndDate = null
      if (duration) {
        suspendEndDate = moment().add(duration, 'M')
      }
      await db.SuspendedUser.create(
        { userId, reason, suspendEndDate, status: true, duration },
        { transaction: t }
      )
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
      await db.User.update(
        { status: status.ACTIVE },
        { where: { id: userId }, transaction: t }
      )
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
    const emailExist = await db.User.findOne({
      where: { email: email.toLowerCase() },
    })
    if (emailExist) {
      throw new Error('Email already in use.')
    }
    const salt = await bcryptjs.genSalt(10)
    const randomPassword = await bcryptjs.hash(
      Math.random().toString(36).slice(-8),
      salt
    )
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
      await db.LockedDescription.create(
        {
          userId,
          reason,
          unlockDate,
          duration,
          status: true,
        } /* , { transaction: t } */
      )
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
      await db.Wallet.increment('amount', {
        by: amount,
        where: { userId },
        transaction: t,
      })
      await db.Transaction.create(
        { userId, amount, type: 'TOPUP_BY_ADMIN', status: true },
        { transaction: t }
      )
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
    const dateBefore90DayFromToday = moment()
      .subtract(90, 'days')
      .format('YYYY-MM-DD HH:mm:ss')
    const user = await db.User.findOne({
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
        [
          Sequelize.literal(
            `(select COUNT(id) from BlockedUsers where blockedUserId = User.id and createdAt >= '${dateBefore90DayFromToday}' )`
          ),
          'noOfBlocksReceived',
        ],
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
        {
          model: db.BlockedUser,
          as: 'blockedUser',
          include: [
            {
              model: db.BlockReason,
            },
          ],
        },
      ],
    })

    const blockedUser = await db.BlockedUser.findAll({
      where: { blockedUserId: userId },
      include: [
        {
          model: db.BlockReason,
        },
      ],
    })
    let data = user
    console.log({ ...data }, 'Type of data details')

    return data
  },
  getCounters: async (query) => {
    const date = query.date ? new Date(query.date) : null;
    
    // End of day date if date is provided
    const endOfDay = date ? new Date(date.setHours(23, 59, 59, 999)) : null;
  
    // Accounts created until the specified date
    const accountsCreated = await db.Profile.count({
      where: endOfDay ? { createdAt: { [db.Sequelize.Op.lte]: endOfDay } } : {},
      group: ['sex'],
    });
  
    const totalAccountsCreated =
      (accountsCreated[0]?.count || 0) + (accountsCreated[1]?.count || 0);
  
    const malesAccountCreated =
      accountsCreated.filter((item) => item.sex === gender.MALE)[0]?.count || 0;
  
    const femalesAccountCreated =
      accountsCreated.filter((item) => item.sex === gender.FEMALE)[0]?.count || 0;
  
    // Active accounts until the specified date
    const activeAccounts = await db.User.count({
      where: {
        status: status.ACTIVE,
        role: roles.USER,
        ...(endOfDay && { createdAt: { [db.Sequelize.Op.lte]: endOfDay } }),
      },
      include: {
        model: db.Profile,
        attributes: ['sex'],
      },
      group: [db.sequelize.col('Profile.sex')],
    });
  
    const totalActiveAccounts =
      (activeAccounts[0]?.count || 0) + (activeAccounts[1]?.count || 0);
  
    const maleActiveAccounts =
      activeAccounts.filter((item) => item.sex === gender.MALE)[0]?.count || 0;
  
    const femaleActiveAccounts =
      activeAccounts.filter((item) => item.sex === gender.FEMALE)[0]?.count || 0;
  
    // User membership counts until the specified date
    const userMembership = await db.UserSetting.count({
      where: endOfDay ? { createdAt: { [db.Sequelize.Op.lte]: endOfDay } } : {},
      group: ['membership'],
    });
  
    // Online users until the specified date
    const onlineUsers = await db.User.count({
      where: {
        role: roles.USER,
        isOnline: true,
        ...(endOfDay && { createdAt: { [db.Sequelize.Op.lte]: endOfDay } }),
      },
      include: {
        model: db.Profile,
        attributes: ['sex'],
      },
      group: [db.sequelize.col('Profile.sex')],
    });
  
    const maleOnlineUsers =
      onlineUsers.filter((item) => item.sex === gender.MALE)[0]?.count || 0;
  
    const femaleOnlineUsers =
      onlineUsers.filter((item) => item.sex === gender.FEMALE)[0]?.count || 0;
  
    // Last logins until the specified date
    const lastLogins = endOfDay
      ? await common.getUserCountsBasedOnLastLogin(endOfDay)
      : await common.getUserCountsBasedOnLastLogin();
  
    // Non-verified users until the specified date
    const nonVerifiedUsers = await db.UserSetting.count({
      where: {
        isEmailVerified: false,
        ...(endOfDay && { createdAt: { [db.Sequelize.Op.lte]: endOfDay } }),
      },
    });
  
    // Suspended accounts until the specified date
    const suspendedAccounts = await db.User.count({
      where: {
        role: roles.USER,
        status: status.SUSPENDED,
        ...(endOfDay && { createdAt: { [db.Sequelize.Op.lte]: endOfDay } }),
      },
    });
  
    // Deactivated accounts until the specified date
    const deactivatedAccounts = await db.DeactivatedUser.count({
      where: endOfDay ? { createdAt: { [db.Sequelize.Op.lte]: endOfDay } } : {},
      group: ['reason'],
    });
  
    // Consolidate counters
    const counters = {
      accountsCreated: totalAccountsCreated,
      malesAccountCreated,
      femalesAccountCreated,
      totalActiveAccounts,
      maleActiveAccounts,
      femaleActiveAccounts,
      userMembership,
      totalOnlineUsers: maleOnlineUsers + femaleOnlineUsers,
      maleOnlineUsers,
      femaleOnlineUsers,
      lastLogins,
      nonVerifiedUsers,
      suspendedAccounts,
      deactivatedAccounts,
    };
  
    return counters;
  },
  
  
}

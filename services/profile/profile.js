const db = require('../../models')
const constants = require('../../config/constants')
const { Op, where, Sequelize } = require('sequelize')
const { getPaginatedResult } = require('../../utils/array-paginate')

module.exports = {
  listAllProfiles: async (body, limit, offset) => {
    const today = new Date();
    const { gender, sortBy, sortOrder, age, nationality, country, city, height, weight, ethnicity, healthStatus, language, skinColor, religiosity, tribialAffiliation, education, financialStatus, maritalStatus } = body
    const whereFilterProfile = {
      height: { [Op.between]: [height[0], height[1]] },
      weight: { [Op.between]: [weight[0], weight[1]] },
      ...(nationality.length > 0 ? { nationality } : {}),
      ...(country.length > 0 ? { country } : {}),
      ...(city.length > 0 ? { city } : {}),
      ...(ethnicity.length > 0 ? { ethnicity } : {}),
      ...(healthStatus.length > 0 ? { healthStatus } : {}),
      ...(skinColor.length > 0 ? { skinColor } : {}),
      ...(religiosity.length > 0 ? { religiosity } : {}),
      ...(education.length > 0 ? { education } : {}),
      ...(financialStatus.length > 0 ? { financialStatus } : {}),
      ...(maritalStatus.length > 0 ? { maritalStatus } : {}),
    }
    if (Object.values(constants.gender).includes(gender)) {
      whereFilterProfile['sex'] = gender
    }
    const users = await db.User.findAll({
      attributes: [
        'id',
        'email',
        'username',
        'status',
        'createdAt',
        [Sequelize.literal(`TIMESTAMPDIFF(YEAR, dateOfBirth, '${today.toISOString()}')`), 'age']
      ],
      include: [
        {
          model: db.Profile,
          where: whereFilterProfile,
        },
        {
          model: db.UserLanguage,
          ...(language.length > 0 ? { where: { language } } : {}),
        },
        {
          model: db.UserSetting,
          attributes: ['isPremium', 'membership']
        },
      ],
      having: {
        'age': {
          [Op.gte]: age[0],
          [Op.lte]: age[1]
        }
      },
      order: [
        [sortBy, sortOrder]
      ]
    })
    const paginatedRecords = getPaginatedResult(users, limit, offset)
    return { count: users.length, rows: paginatedRecords }
  },
  getUserProfile: async (userId) => {
    return db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Profile
        },
        {
          model: db.UserLanguage
        }
      ]
    })
  },
  updateProfile: async (body, userId) => {
    const t = await db.sequelize.transaction()
    try {
      const { userLanguages } = body
      if (userLanguages) {
        await db.UserLanguage.destroy({ where: { userId } })
        if (userLanguages.length > 0) {
          const langData = userLanguages.map(lang => { return { userId, language: lang } })
          await db.UserLanguage.bulkCreate(langData, { transaction: t })
        }
        delete body['language']
      }
      if (Object.keys(body).length > 0) {
        await db.Profile.update({ ...body }, { where: { userId }, transaction: t })
      }
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      console.log(error)
      return false
    }
  },
  saveOrUnsaveProfile: async (userId, savedUserId) => {
    const isAlreadySaved = await db.SavedProfile.findOne({ where: { userId, savedUserId } })
    if (!isAlreadySaved) {
      await db.SavedProfile.create({ userId, savedUserId })
      return true
    }
    await db.SavedProfile.destroy({ where: { userId, savedUserId } })
    return false
  },
  getMySavedProfiles: async (userId) => {
    return db.SavedProfile.findAll({
      where: { userId },
      include: {
        model: db.User,
        as: 'savedUser',
        attributes: ['id', 'email', 'username', 'language', 'createdAt'],
        include: {
          model: db.Profile
        }
      }
    })
  },
  getUsersWhoSavedMyProfile: async (userId) => {
    return db.SavedProfile.findAll({
      where: { savedUserId: userId },
      include: {
        model: db.User,
        as: 'user',
        attributes: ['id', 'email', 'username', 'language', 'createdAt'],
        include: {
          model: db.Profile
        }
      }
    })
  },
  getMyMatchesProfiles: async (userId) => {
    let matchesProfiles = await db.Match.findAll({
      where: {
        [Op.or]: [
          { userId },
          { otherUserId: userId }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'createdAt', 'code'],
          include: {
            model: db.Profile
          },
        },
        {
          model: db.User,
          as: 'otherUser',
          attributes: ['id', 'username', 'email', 'createdAt', 'code'],
          include: {
            model: db.Profile
          },
        }
      ]
    })
    matchesProfiles = JSON.parse(JSON.stringify(matchesProfiles))
    matchesProfiles = matchesProfiles.map(match => {
      if (match.userId === userId) {
        return {
          id: match.id,
          user: match.otherUser
        };
      } else {
        return {
          id: match.id,
          user: match.user
        };
      }
    })
    return matchesProfiles
  },
}

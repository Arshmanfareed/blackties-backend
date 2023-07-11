const db = require('../../models')
const constants = require('../../config/constants')
const { Op, where, Sequelize } = require('sequelize')
const { getPaginatedResult } = require('../../utils/array-paginate')
const helperFunctions = require('../../helpers')

module.exports = {
  listAllProfiles: async (body, limit, offset) => {
    const today = new Date();
    const { loggedInUserId, gender, sortBy, sortOrder, age, nationality, country, city, height, weight, ethnicity, healthStatus, language, skinColor, religiosity, tribialAffiliation, education, financialStatus, maritalStatus, usernameOrCode, isGold } = body
    const { REGULAR, SILVER, GOLD } = constants.membership
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
    let sortOrderQuery = [db.UserSetting, 'lastSeen', 'ASC'] // default sorting
    if (sortBy != 'lastSeen') {
      sortOrderQuery = [sortBy, sortOrder]
    }
    const usernameOrCodeQuery = usernameOrCode ? `%${usernameOrCode}%` : "%%";
    const userAttributesToSelect = [
      'id',
      'email',
      'username',
      'status',
      'createdAt',
      'code',
      [Sequelize.literal(`TIMESTAMPDIFF(YEAR, dateOfBirth, '${today.toISOString()}')`), 'age'],
    ]
    if (loggedInUserId) {
      userAttributesToSelect.push(
        [
          Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${loggedInUserId} AND savedUserId = User.id)`), 'isSaved'
        ]
      )
    }
    const users = await db.User.findAll({
      where: {
        role: constants.roles.USER,
        [Op.or]: {
          username: { [Op.like]: usernameOrCodeQuery },
          code: { [Op.like]: usernameOrCodeQuery },
        }
      },
      attributes: userAttributesToSelect,
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
          attributes: ['isPremium', 'membership', 'lastSeen'],
          where: { membership: isGold ? 'Gold' : [REGULAR, SILVER, GOLD] },
        },
      ],
      having: {
        'age': {
          [Op.gte]: age[0],
          [Op.lte]: age[1]
        }
      },
      order: [
        sortOrderQuery
      ]
    })
    const paginatedRecords = getPaginatedResult(users, limit, offset)
    return { count: users.length, rows: paginatedRecords }
  },
  getUserProfile: async (userId) => {
    return helperFunctions.getUserProfile(userId)
  },
  updateProfile: async (body, userId) => {
    const t = await db.sequelize.transaction()
    try {
      const { userLanguages, username } = body
      if (userLanguages) {
        await db.UserLanguage.destroy({ where: { userId } })
        if (userLanguages.length > 0) {
          const langData = userLanguages.map(lang => { return { userId, language: lang } })
          await db.UserLanguage.bulkCreate(langData, { transaction: t })
        }
        delete body['language']
      }
      if (username) {
        await db.User.update({ username }, { where: { id: userId }, transaction: t })
        delete body.username
      }
      if (Object.keys(body).length > 0) {
        await db.Profile.update({ ...body }, { where: { userId }, transaction: t })
      }
      await t.commit()
      return helperFunctions.getUserProfile(userId)
    } catch (error) {
      console.log(error)
      await t.rollback()
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
        attributes: ['id', 'email', 'username', 'language', 'code', 'createdAt'],
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
        attributes: ['id', 'email', 'username', 'language', 'code', 'createdAt'],
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
  getUserProfileWithDetails: async (loginUserId, otherUserId) => {
    let user, extraInfoRequest, pictureRequest, contactDetailsRequest;
    user = db.User.findOne({
      where: { id: otherUserId },
      attributes: ['id', 'username', 'email', 'code', 'createdAt'],
      include: [
        {
          model: db.Profile
        },
        {
          model: db.UserLanguage
        },
      ]
    })
    const requestsWhereClause = {
      [Op.or]: [
        { requesterUserId: loginUserId, requesteeUserId: otherUserId },
        { requesterUserId: otherUserId, requesteeUserId: loginUserId },
      ],
    }
    extraInfoRequest = db.ExtraInfoRequest.findOne({
      where: requestsWhereClause,
      include: {
        model: db.UserQuestionAnswer
      },
      order: [['id', 'DESC']]
    })
    pictureRequest = db.PictureRequest.findOne({
      where: requestsWhereClause,
      order: [['id', 'DESC']]
    })
    contactDetailsRequest = db.ContactDetailsRequest.findOne({
      where: requestsWhereClause,
      order: [['id', 'DESC']],
      include: {
        model: db.ContactDetails
      }
    })
    const promiseResolved = await Promise.all([user, extraInfoRequest, pictureRequest, contactDetailsRequest]);
    [user, extraInfoRequest, pictureRequest, contactDetailsRequest] = promiseResolved
    return { user, pictureRequest, extraInfoRequest, contactDetailsRequest }
  },
}

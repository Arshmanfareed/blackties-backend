const db = require('../../models')
const constants = require('../../config/constants')
const { Op, where, Sequelize } = require('sequelize')
const sendMail = require('../../utils/sendgrid-mail')
const { getPaginatedResult } = require('../../utils/array-paginate')
const helperFunctions = require('../../helpers')

module.exports = {
  listAllProfiles: async (body, limit, offset) => {
    const today = new Date()
    const {
      loggedInUserId,
      gender,
      sortBy,
      sortOrder,
      age,
      nationality,
      country,
      city,
      height,
      weight,
      ethnicity,
      healthStatus,
      language,
      skinColor,
      religiosity,
      tribialAffiliation,
      education,
      financialStatus,
      maritalStatus,
      usernameOrCode,
      isGold,
    } = body
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
    if (tribialAffiliation === false) {
      whereFilterProfile['tribe'] = 'not_applicable'
    } else if (tribialAffiliation === true) {
      whereFilterProfile['tribe'] = {
        [Op.ne]: 'not_applicable',
      }
    }
    if (Object.values(constants.gender).includes(gender)) {
      whereFilterProfile['sex'] = gender
    }
    let sortOrderQuery = [db.UserSetting, 'lastSeen', 'DESC'] // default sorting
    if (sortBy != 'lastSeen') {
      sortOrderQuery = [sortBy, sortOrder]
    }
    const usernameOrCodeQuery = usernameOrCode ? `%${usernameOrCode}%` : '%%'
    const userAttributesToSelect = [
      'id',
      'email',
      'username',
      'status',
      'createdAt',
      'code',
      'isOnline',
      [
        Sequelize.literal(
          `TIMESTAMPDIFF(YEAR, dateOfBirth, '${today.toISOString()}')`
        ),
        'age',
      ],
    ]
    const includeTables = [
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
    ]
    if (loggedInUserId) {
      userAttributesToSelect.push([
        Sequelize.literal(
          `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${loggedInUserId} AND savedUserId = User.id)`
        ),
        'isSaved',
      ])
      includeTables.push({
        model: db.BlockedUser,
        as: 'blockedUser',
        where: { blockerUserId: loggedInUserId },
        required: false,
      })
      includeTables.push({
        model: db.BlockedUser,
        as: 'blockerUser',
        where: { blockedUserId: loggedInUserId },
        required: false,
      })
    }
    const order = sortBy === '' ? [['isOnline', 'DESC']] : sortBy === 'lastSeen' ? [['isOnline', 'DESC'], sortOrderQuery] : [sortOrderQuery] ;
    const users = await db.User.findAll({
      where: {
        role: constants.roles.USER,
        status: constants.status.ACTIVE,
        [Op.or]: {
          username: { [Op.like]: usernameOrCodeQuery },
          code: { [Op.like]: usernameOrCodeQuery },
        },
      },
      attributes: userAttributesToSelect,
      include: includeTables,
      having: {
        age: {
          [Op.gte]: age[0],
          [Op.lte]: age[1],
        },
      },
      order,
    });
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
          const langData = userLanguages.map((lang) => {
            return { userId, language: lang }
          })
          await db.UserLanguage.bulkCreate(langData, { transaction: t })
        }
        delete body['language']
      }
      if (username) {
        await db.User.update(
          { username },
          { where: { id: userId }, transaction: t }
        )
        delete body.username
      }
      const { description: descriptionBefore } = await db.Profile.findOne({
        where: { userId },
      })
      console.log(descriptionBefore, 'User Description on updated')

      let userProfile = JSON.parse(
        JSON.stringify(await db.Profile.findOne({ where: { userId: userId } }))
      )
      delete userProfile['description']
      delete userProfile['tribe']
      delete userProfile['longitude']
      delete userProfile['latitude']
      delete userProfile['occupationStatus']
      delete userProfile['occupationField']
      delete userProfile['occupationFunction']
      delete userProfile['reading']
      delete userProfile['family']
      delete userProfile['noAFanOf']
      delete userProfile['letsTalkAbout']
      delete userProfile['movies']
      delete userProfile['clothing']
      delete userProfile['countryOfEducation']
      delete userProfile['beard']
      console.log(userProfile, 'User Profile on updated')

      const findNullValues = Object.values(userProfile).filter(
        (el) => el === null
      )
      console.log(findNullValues, 'User Profile null values on updated')

      if (Object.keys(body).length > 0) {
        await db.Profile.update(
          { ...body },
          { where: { userId }, transaction: t }
        )

       
      }

      await t.commit()

      if (findNullValues.length > 0) {
        let updatedProfile = JSON.parse(
          JSON.stringify(
            await db.Profile.findOne({ where: { userId: userId } })
          )
        )
        delete updatedProfile['description']
        delete updatedProfile['tribe']
        delete updatedProfile['longitude']
        delete updatedProfile['latitude']
        delete updatedProfile['occupationStatus']
        delete updatedProfile['occupationField']
        delete updatedProfile['occupationFunction']
        delete updatedProfile['reading']
        delete updatedProfile['family']
        delete updatedProfile['noAFanOf']
        delete updatedProfile['letsTalkAbout']
        delete updatedProfile['movies']
        delete updatedProfile['clothing']
        delete updatedProfile['countryOfEducation']
        delete updatedProfile['beard']
        console.log(updatedProfile, 'User Profile on updated')

        const findUpdatedNullValues = Object.values(updatedProfile).filter(
          (el) => el === null
        )
        console.log(
          findUpdatedNullValues,
          'User Updated Profile null values on updated'
        )
        if (findUpdatedNullValues.length == 0) {
          await db.UserSetting
          if (updatedProfile?.sex == constants.gender.MALE) {
            // let date = new Date()
            // date.setDate(date.getDate() + 2)

            // await db.UserFeature.create({
            //   userId: userId,
            //   featureId: 12,
            //   featureType: constants.featureTypes.ANSWER_QUESTION,
            //   status: 1,
            //   validityType: constants.featureValidity.DAYS,
            //   expiryDate: date,
            // })
            await helperFunctions.giveAllInfoFilledReward(userId)
          } else {
            await db.UserFeature.create({
              userId: userId,
              featureId: 11,
              featureType: constants.featureTypes.PICTURE_REQUEST,
              status: 1,
              validityType: constants.featureValidity.COUNT,
              remaining: 3,
            })
          }
          await db.UserSetting.update(
            { isFilledAllInfo: true },
            { where: { userId } }
          )
        }
      }

      if (body?.description) {
        // add description reward only first time
        if (!descriptionBefore) {
          // await helperFunctions.giveDescriptionAddedReward(userId)
        }
      }
      if (body?.isFilledAllInfo) {
        // Fill in all your information (Unlocks 1 day of answers)
        await db.UserSetting.update(
          { isFilledAllInfo: true },
          { where: { userId } }
        )
        await helperFunctions.giveAllInfoFilledReward(userId)
      }
      return helperFunctions.getUserProfile(userId)
    } catch (error) {
      console.log(error)
      await t.rollback()
      return false
    }
  },
  saveOrUnsaveProfile: async (userId, savedUserId) => {
    const isAlreadySaved = await db.SavedProfile.findOne({
      where: { userId, savedUserId },
    })
    if (!isAlreadySaved) {
      await db.SavedProfile.create({ userId, savedUserId })
      
      const C_user = await db.User.findOne({
        where: { id: userId },
        attributes: ['email', 'username'], 
      });

      const savedUser = await db.User.findOne({
        where: { id: savedUserId },
        attributes: ['email', 'username'], 
      });

      
      // if (savedUser) {

      //   const username = savedUser.username; 
      //   const user = C_user.username; 
        

      //   const testUser = await db.User.findOne({
      //     where: { id: savedUserId },
      //     attributes: ['language'],
      //   });
      //   const message = `Hello ${username}! ${user} saved your profile`;
      //   if(testUser.dataValues.language == 'en'){

          
      //     sendMail(
      //       process.env.USER_NOTIFICATION_TEMPLATE_ID,
      //       savedUser.email,
      //       'Welcome to Mahaba',
      //       { message },
      //       process.env.MAIL_FROM_NOTIFICATION,
      //     );
      //   }else{

      //     const USER_NOTIFICATION_TEMPLATE_ID_AR = process.env.USER_NOTIFICATION_TEMPLATE_ID_AR;
      //     const message = `Hello ${username}! ${user} saved your profile (AR)`;
      //     sendMail(
      //       USER_NOTIFICATION_TEMPLATE_ID_AR,
      //       savedUser.email,
      //       'Welcome to Mahaba',
      //       { message },
      //       process.env.MAIL_FROM_NOTIFICATION,
      //     );
      //   }

        
      // }
      return true
    }
    await db.SavedProfile.destroy({ where: { userId, savedUserId } })
    return false
  },
  getMySavedProfiles: async (userId) => {
    return db.SavedProfile.findAll({
      where: { userId },
      attributes: [
        'id',
        'userId',
        'savedUserId',
        'createdAt',
      ], 
      include: {
        model: db.User,
        as: 'savedUser',
        attributes: [
          'id',
          'email',
          'username',
          'language',
          'code',
          'createdAt',          
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
    })
  },
  getUsersWhoSavedMyProfile: async (userId) => {
    return db.SavedProfile.findAll({
      where: { savedUserId: userId },
      attributes: [
        'id',
        'savedUserId',
        'userId',
        'createdAt',
      ],
      include: {
        model: db.User,
        as: 'user',
        attributes: [
          'id',
          'email',
          'username',
          'language',
          'code',
          'createdAt',
          [
            Sequelize.literal(
              `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = user.id)`
            ),
            'isSaved',
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ],
      },
    })
  },
  getMyMatchesProfiles: async (userId) => {
    const userAttributes = [
      'id',
      'username',
      'email',
      'createdAt',
      'code',
      [
        Sequelize.literal(
          `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = user.id)`
        ),
        'isSaved',
      ],
    ]
    let matchesProfiles = await db.Match.findAll({
      where: {
        [Op.or]: [{ userId }, { otherUserId: userId }],
        isCancelled: { [Op.ne]: 1 } 
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: userAttributes,
          include: [
            {
              model: db.Profile,
            },
            {
              model: db.UserSetting,
              attributes: ['isPremium', 'membership'],
            },
            {
              model: db.BlockedUser,
              as: 'blockedUser',
              where: { blockerUserId: userId },
              required: false,
            },
            {
              model: db.BlockedUser,
              as: 'blockerUser',
              where: { blockedUserId: userId },
              required: false,
            },
          ],
        },
        {
          model: db.User,
          as: 'otherUser',
          attributes: userAttributes,
          include: [
            {
              model: db.Profile,
            },
            {
              model: db.UserSetting,
              attributes: ['isPremium', 'membership'],
            },
            {
              model: db.BlockedUser,
              as: 'blockedUser',
              where: { blockerUserId: userId },
              required: false,
            },
            {
              model: db.BlockedUser,
              as: 'blockerUser',
              where: { blockedUserId: userId },
              required: false,
            },
          ],
        },
      ],
    })
    matchesProfiles = JSON.parse(JSON.stringify(matchesProfiles))
    matchesProfiles = matchesProfiles.map((match) => {
      if (match.userId === userId) {
        return {
          id: match.id,
          user: match.otherUser,
        }
      } else {
        return {
          id: match.id,
          user: match.user,
        }
      }
    })
    return matchesProfiles
  },
  getUserProfileWithDetails: async (loginUserId, otherUserId) => {
    if(otherUserId == 3){
      return {
        message: 'Not allowed!',
        key:'not_allowed',
      }
    }

    const existUser = await db.User.findOne({
      where: { id: otherUserId },
    })
    if (!existUser) {
     return {
        message: 'Not allowed!',
        key:'not_allowed',
      }
    }
    let extraInfoRequest = (pictureRequest = contactDetailsRequest = null)
    const userAttributes = ['id', 'username', 'email', 'code', 'createdAt', 'status']
    let includeTables = [
      {
        model: db.Profile,
      },
      {
        model: db.UserLanguage,
      },
      {
        model: db.UserSetting,
        attributes: ['isPremium', 'membership', 'lastSeen'],
      },
    ]
    if (loginUserId) {
      userAttributes.push([
        Sequelize.literal(
          `EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${loginUserId} AND savedUserId = ${otherUserId})`
        ),
        'isSaved',
      ])
      includeTables = [
        ...includeTables,
        {
          model: db.BlockedUser,
          as: 'blockedUser',
          where: { blockerUserId: loginUserId },
          required: false,
        },
        {
          model: db.BlockedUser,
          as: 'blockerUser',
          where: { blockedUserId: loginUserId },
          required: false,
        },
      ]
    }
    const user = await db.User.findOne({
      where: { id: otherUserId },
      attributes: userAttributes,
      include: includeTables,
    })
    if (!loginUserId) {
      return { user, extraInfoRequest, pictureRequest, contactDetailsRequest }
    }
    const requestsWhereClause = {
      [Op.or]: [
        { requesterUserId: loginUserId, requesteeUserId: otherUserId },
        { requesterUserId: otherUserId, requesteeUserId: loginUserId },
      ],
    }
    extraInfoRequest = db.ExtraInfoRequest.findOne({
      where: requestsWhereClause,
      include: {
        model: db.UserQuestionAnswer,
      },
      order: [['id', 'DESC']],
    })
    pictureRequest = db.PictureRequest.findOne({
      where: requestsWhereClause,
      order: [['id', 'DESC']],
    })
    contactDetailsRequest = db.ContactDetailsRequest.findOne({
      where: requestsWhereClause,
      order: [['id', 'DESC']],
      include: {
        model: db.ContactDetails,
      },
    })
    pendingContactDetails = db.ContactDetailsRequest.findOne({
      where: {
        [Op.and]: [
          {
            requesterUserId: loginUserId,
            status: constants.requestStatus.PENDING,
          },
        ],
      },
      order: [['id', 'DESC']],
    })
    userMatch = db.Match.findOne({
      where: {
        [Op.or]: [
          { otherUserId: otherUserId }, // either match b/w user1
          { userId: otherUserId }, // either match b/w user2
        ],
        isCancelled: 0,
      },
    })

    const promiseResolved = await Promise.all([
      extraInfoRequest,
      pictureRequest,
      contactDetailsRequest,
      pendingContactDetails,
      userMatch,
    ])
    ;[
      extraInfoRequest,
      pictureRequest,
      contactDetailsRequest,
      pendingContactDetails,
      userMatch,
    ] = promiseResolved
    return {
      user,
      pictureRequest,
      extraInfoRequest,
      contactDetailsRequest,
      pendingContactDetails,
      userMatch,
    }
  },
}

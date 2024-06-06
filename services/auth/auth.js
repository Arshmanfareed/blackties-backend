const db = require('../../models')
const {
  roles,
  status,
  membership,
  requestStatus,
} = require('../../config/constants')
const moment = require('moment')
const { Op } = require('sequelize')
const bcryptjs = require('bcryptjs')
const sendMail = require('../../utils/sendgrid-mail')
const { generateJWT } = require('../../utils/generate-jwt')
const helpers = require('../../helpers')
const { translate } = require('../../utils/translation')
const constants = require('../../config/constants')
const helperFunctions = require('../../helpers')

module.exports = {
  verifyCode: async (body) => {
    const { userId, code, phoneNo } = body
    let user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      throw new Error('User does not exist.')
    }
    if (user.otp == code) {
      // code is currect then check for the expiry of code
      const otpExpiry = moment(user.otpExpiry)
      const dateNow = moment(Date.now())
      const DiffInMins = dateNow.diff(otpExpiry, 'minutes')
      if (DiffInMins > 5) {
        // check for expiry
        throw new Error('OTP is expired.')
      }
      // remove the code and update the phoneNo
      await db.User.update(
        { otp: null, otpExpiry: null, phoneNo },
        { where: { id: user.id } }
      )
      await db.UserSetting.update(
        {
          isPhoneVerified: true,
        },
        { where: { userId } }
      )
      helpers.givePhoneVerifyReward(userId)
      return db.UserSetting.findOne({ where: { userId } })
    } else {
      throw Error('Incorrect OTP, please try again')
    }
  },
  UpdateLanguage: async (body) => {
    const { userId, language } = body
    let user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      throw new Error('User does not exist.')
    }
    if (language == 'en' || language == 'ar' ) {
      
      // remove the old and update the new
      await db.User.update(
        { language: language },
        { where: { id: user.id } }
      )
     
    } else {
      throw Error('You can only select EN or AR.')
    }
  },
  findEmail: async (body) => {
    const { email } = body
    let userExistByEmail = await db.User.findOne({
      where: { email },
    })
    if (userExistByEmail) {
      throw new Error('An account using this email already exists')
    }
  },
  UpdateCurrency: async (body) => {
    const { userId, currency } = body
    let user = await db.User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    })
    if (!user) {
      throw new Error('User does not exist.')
    }
    if (currency == 'united_states_dollar' || currency == 'saudi_riyal' ) {
     
      // remove the old and update the new
      await db.User.update(
        { currency: currency },
        { where: { id: userId } }
      )
    } else {
      throw Error('You can only select united_states_dollar or saudi_riyal.')
    }
  },
  logout: async (userId) => {
    return db.User.update({ fcmToken: null }, { where: { id: userId } })
  },
  signUp: async (body) => {
    const t = await db.sequelize.transaction()
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000)
      const {
        email,
        username,
        password,
        sex,
        dateOfBirth,
        height,
        weight,
        country,
        city,
        nationality,
        religiosity,
        education,
        work,
        skinColor,
        ethnicity,
        maritalStatus,
        language,
        tribe,
      } = body
      let userExistByEmail = await db.User.findOne({
        where: { email /* [Op.or]: [{ email }, { username }] */ },
      })
      if (userExistByEmail) {
        throw new Error('An account using this email already exists')
      }
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password, salt)
      const userCode = await helpers.generateUserCode(sex)
      let currency;
      if (country === 'saudi_arabia') {
        currency = 'saudi_riyal';
      } else {
        currency = 'united_states_dollar';
      }
      let userCreated = await db.User.create(
        {
          email,
          username,
          password: hashedPassword,
          status: status.ACTIVE,
          otp: verificationCode,
          otpExpiry: new Date(),
          language,
          code: userCode,
          currency: currency,
        },
        { transaction: t }
      )
      const { id: userId } = userCreated
      const profileCreated = await db.Profile.create(
        {
          userId,
          sex,
          dateOfBirth,
          height,
          weight,
          country,
          city,
          nationality,
          religiosity,
          education,
          work,
          skinColor,
          ethnicity,
          maritalStatus,
          tribe,
        },
        { transaction: t }
      )
      const wallet = await db.Wallet.create(
        { userId, amount: 0 },
        { transaction: t }
      )
      const userSetting = await db.UserSetting.create(
        {
          userId,
          isNotificationEnabled: true,
          isPremium: false,
          membership: membership.REGULAR,
          lastSeen: new Date(),
        },
        { transaction: t }
      )
      await db.NotificationSetting.create({ userId }, { transaction: t })
      await t.commit()
      // welcome email

      const testUser = await db.User.findOne({
        where: { id: userId },
        attributes: ['language'],
      });
      const activationLink = process.env.BASE_URL_DEV + "/auth/account-activation/" + userCreated.id + "/" + verificationCode
      const dynamicParams = {
        link: activationLink
      }
      if (country === 'saudi_arabia') {
        sendMail(
          process.env.WELCOME_EMAIL_TEMPLATE_ID_AR,
          email,
          'Welcome to Mahaba',
          { 
            nickname: username, 
            link: activationLink
          }
        )        
      } else {
        sendMail(
          process.env.WELCOME_EMAIL_TEMPLATE_ID,
          email,
          'Welcome to Mahaba',
          { 
            nickname: username, 
            link: activationLink
          }
        )
      }
      // send OTP or verification link
      // helpers.sendAccountActivationLink(
      //   email,
      //   userCreated.id,
      //   verificationCode,
      //   language
      // )
      // auth token
      userCreated = JSON.parse(JSON.stringify(userCreated))
      delete userCreated.password
      const authToken = generateJWT(userCreated)
      userCreated['Wallet'] = wallet
      userCreated['UserSetting'] = userSetting

      let userFeature = {
        userId: userCreated.id,
        featureId: 12,
        featureType: constants.featureTypes.ANSWER_QUESTION,
        status: 1,
      }

      if (sex == constants.gender.MALE) {
        let date = new Date()
        date.setDate(date.getDate() + 2)
        userFeature['validityType'] = constants.featureValidity.DAYS
        userFeature['expiryDate'] = date
      } else {
        userFeature['validityType'] = constants.featureValidity.LIFETIME
        let userFeatureExtraInformation = await db.UserFeature.create({
          userId: userCreated.id,
          featureId: 13,
          featureType: constants.featureTypes.EXTRA_INFORMATION_REQUEST,
          status: 1,
          validityType: constants.featureValidity.LIFETIME,
        })
      }

      let userFeatureCreated = await db.UserFeature.create({ ...userFeature })

      return {
        userCreated,
        profileCreated,
        JWTToken: authToken,
        userFeature: userFeatureCreated,
      }
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  login: async (body) => {
    const { email, password, fcmToken } = body
    let user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.Wallet,
          attributes: ['amount'],
        },
        {
          model: db.UserSetting,
        },
        {
          model: db.Profile,
        },
        {
          model: db.DeactivatedUser,
        },
        {
          model: db.SuspendedUser,
        },
      ],
    })

  
    
    if (!user) {
      throw new Error('Wrong email or password')
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Wrong email or password')
    }

    if (user.DeactivatedUser) {
      const createdAt = new Date(user.DeactivatedUser.createdAt);
      const futureTime = new Date(createdAt.getTime() + (48 * 60 * 60 * 1000)); // 48 hours * 60 minutes * 60 seconds * 1000 milliseconds
      const difference = futureTime - Date.now();
      const hours = Math.ceil(difference / (1000 * 60 * 60));
      if (hours <= 0) {
        // If 48 hours have passed
        const response = {
          resCheck: {
              key: "user_deactivated_by_own",
              userId: user.id,
              is_login: false
          }
        };
        // Send response to client-side
       return response;
        
      } else {
        // If within 48 hours
        throw new Error(`You have decided to deactivate your account. Log back in ${hours} hours if you decide to re-activate it`);
      }    
    }
    if (user.status === status.DEACTIVATED) {
      // deactivated user
      throw new Error('Your account has been suspended')
    } else if (user.status === status.SUSPENDED) {
      let errorMessage = 'Your account has been suspended'
      if (user.SuspendedUser.duration == 1) {
        errorMessage += ` for 1 month.`
      }else if(user.SuspendedUser.duration == 2) {
        errorMessage += ` for 3 months.`
      }else{
        errorMessage += ` for 6 months.`
      }
      throw new Error(errorMessage)
    }
    const userMatch = await db.Match.findOne({
      where: {
        [Op.or]: [
          { otherUserId: user.id }, // either match b/w user1 or user2
          { userId: user.id }, // either match b/w user1 or user2
        ],
        isCancelled: 0,
      },
    })
    // update fcmToken in db
    await db.User.update(
      { fcmToken: fcmToken || null, lastLogin: new Date() },
      { where: { id: user.id } }
    )
    user = JSON.parse(JSON.stringify(user))
    delete user['password']
    const jwtPayload = { ...user }
    delete jwtPayload['Profile']
    delete jwtPayload['Wallet']
    const authToken = generateJWT(jwtPayload)
    user['authToken'] = authToken
    user['userMatch'] = userMatch
    return user
  },
  activateAccount: async (userId, code) => {
    
    if (!userId || !code) return { success: false }
    var user = await db.User.findOne({ where: { id: userId },     
      include: [
      {
        model: db.Wallet,
        attributes: ['amount'],
      },
      {
        model: db.UserSetting,
      },
      {
        model: db.Profile,
      },
      {
        model: db.DeactivatedUser,
      },
      {
        model: db.SuspendedUser,
      },
    ], })
    
    if (user && user.otp == Number(code)) {
      
      if (user.tempEmail) {

        
        // update email case
        await db.User.update(
          {
            email: user.tempEmail,
            tempEmail: null,
            otp: null,
            status: status.ACTIVE,
          },
          { where: { id: userId } }
        )
      } else {
        await db.User.update(
          { otp: null, status: status.ACTIVE },
          { where: { id: userId } }
        )
      }
      await db.UserSetting.update(
        { isEmailVerified: true },
        { where: { userId } }
      )
      helpers.giveEmailVerifyReward(userId)
      const updatedUser = await db.User.findOne({ where: { id: userId } })
    
      user = JSON.parse(JSON.stringify(user))
      const jwtPayload = { ...user }
      const authToken = generateJWT(jwtPayload)
      user['authToken'] = authToken
      user['updatedUser'] = updatedUser
    }
    return { success: true, user }
  },
  resetPassword: async (email) => {
    const user = await db.User.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    })
    if (!user) throw new Error('User does not Exist.')
    const jwtToken = generateJWT(user.toJSON())
    await db.PasswordReset.destroy({ where: { userId: user.id } })
    await db.PasswordReset.create({ userId: user.id })
    const resetPasswordLink =
      process.env.RESET_PASSWORD_PAGE + '?token=' + jwtToken
    const templatedId = process.env.PASSWORD_RESET_TEMPLATE_ID
    const dynamicParams = {
      link: resetPasswordLink,
    }

    const testUser = await db.User.findOne({
      where: { id: user.id },
      attributes: ['language'],
    });
    if(testUser.dataValues.language == 'en'){
      sendMail(templatedId, email, 'Password Reset Link', dynamicParams)
    }else{
      sendMail(process.env.PASSWORD_RESET_TEMPLATE_ID_AR, email, 'Password Reset Linkzz', dynamicParams)
    }

    
    return true
  },
  emailConfirm: async (email) => {
    const user = await db.User.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    })

    if (!user) throw new Error('User does not Exist.')
    const userSetting = await db.UserSetting.findOne({
      where: { userId: user.id },
    })
    if (userSetting && userSetting.isEmailVerified) {
      throw new Error('User email has already been verified')
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000)

    await db.User.update(
      {
        otp: verificationCode,
        otpExpiry: new Date(),
      },
      { where: { id: user.id } }
    )
    helperFunctions.sendAccountActivationLink(email, user.id, verificationCode)

    return true
  },
  verifyPasswordResetLink: async (userId) => {
    const passwordResetLink = await db.PasswordReset.findOne({
      where: { userId },
    })
    let isValidLink = false
    if (passwordResetLink) {
      //  link is only valid for 3 days (checking link creation date)
      const linkCreationDate = moment(passwordResetLink.createdAt)
      const dateNow = moment(Date.now())
      const DiffInDays = dateNow.diff(linkCreationDate, 'days')
      if (DiffInDays <= 3) {
        isValidLink = true
      }
    }
    return isValidLink
  },
  autoVerificationLogin: async (userId, authToken) => {
    // const { email, password, fcmToken } = body
    let user = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Wallet,
          attributes: ['amount'],
        },
        {
          model: db.UserSetting,
        },
        {
          model: db.Profile,
        },
        {
          model: db.DeactivatedUser,
        },
        {
          model: db.SuspendedUser,
        },
      ],
    })

  
    if (user.status === status.DEACTIVATED) {
      // deactivated user
      throw new Error('Your account has been suspended')
    } else if (user.status === status.SUSPENDED) {
      let errorMessage = 'Your account has been suspended'
      if (user.SuspendedUser.duration == 1) {
        errorMessage += ` for 1 month.`
      }else if(user.SuspendedUser.duration == 2) {
        errorMessage += ` for 3 months.`
      }else{
        errorMessage += ` for 6 months.`
      }
      throw new Error(errorMessage)
    }
    const userMatch = await db.Match.findOne({
      where: {
        [Op.or]: [
          { otherUserId: user.id }, // either match b/w user1 or user2
          { userId: user.id }, // either match b/w user1 or user2
        ],
        isCancelled: 0,
      },
    })
    // update fcmToken in db
    // await db.User.update(
    //   { fcmToken: fcmToken || null, lastLogin: new Date() },
    //   { where: { id: user.id } }
    // )
    user = JSON.parse(JSON.stringify(user))
    // delete user['password']
    // const jwtPayload = { ...user }
    // delete jwtPayload['Profile']
    // delete jwtPayload['Wallet']
    // const authToken = generateJWT(jwtPayload)
    user['authToken'] = authToken
    user['userMatch'] = userMatch
    return user
    
  },
  changePassword: async (body, userId) => {
    const { oldPassword, password } = body
    if (oldPassword && oldPassword !== '' && oldPassword !== null) {
      //  if old password is comming from frontend its means user is chaning password inside app not reset
      // need to validate whether user inputted old password is correct or not
      const user = await db.User.findOne({ where: { id: userId } })
      if (!user) {
        throw new Error('User not found.')
      }
      const isCorrectPassword = await bcryptjs.compare(
        oldPassword,
        user.password
      )
      if (!isCorrectPassword) {
        throw new Error('You current password is wrong')
      }
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    await db.User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    )
    await db.PasswordReset.destroy({ where: { userId } })
    return true
  },
  deactivateAccount: async (userId, body) => {
    const t = await db.sequelize.transaction()
    try {
      const { reason, feedback } = body
      await Promise.allSettled([
        // update user status in db
        db.User.update(
          { status: status.DEACTIVATED },
          { where: { id: userId }, transaction: t }
        ),
        // store reason and feedback
        db.DeactivatedUser.create(
          { userId, reason, feedback },
          { transaction: t }
        ),
        // reject incoming request
        db.ContactDetailsRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesteeUserId: userId }, transaction: t }
        ),
        db.PictureRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesteeUserId: userId }, transaction: t }
        ),
        db.ExtraInfoRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesteeUserId: userId }, transaction: t }
        ),
        // cancelled the requests this user made with other users
        db.ContactDetailsRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesterUserId: userId }, transaction: t }
        ),
        db.PictureRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesterUserId: userId }, transaction: t }
        ),
        db.ExtraInfoRequest.update(
          { status: requestStatus.REJECTED },
          { where: { requesterUserId: userId }, transaction: t }
        ),
        // match is cancelled
        db.Match.update(
          { isCancelled: true, cancelledBy: userId },
          {
            where: {
              isCancelled: false,
              [Op.or]: {
                userId,
                otherUserId: userId,
              },
            },
            transaction: t,
          }
        ),
      ])
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw new Error(error.message)
    }
  },
  reactivateAccount: async (body) => {
    const t = await db.sequelize.transaction()
    
    try {
      const { userId } = body
      const { createdAt } = await db.DeactivatedUser.findOne({
        where: { userId },
      })
      // const deactivatedAt = moment(createdAt)
      // const dateNow = moment(Date.now())
      // const deactivationDuration = dateNow.diff(deactivatedAt, 'days')
      // if (deactivationDuration >= 30) {
      //   throw new Error(
      //     'You account reactivation period has passed, now you cannot reactivate your account.'
      //   )
      // }
      // update user status in db
      await Promise.allSettled([
        db.User.update(
          { status: status.ACTIVE },
          { where: { id: userId }, transaction: t }
        ),
        db.DeactivatedUser.destroy({ where: { userId }, transaction: t }),
      ])
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      console.log(error)
      throw new Error(error.message)
    }
  },
}

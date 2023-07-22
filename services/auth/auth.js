const db = require('../../models')
const { roles, status, membership } = require('../../config/constants')
const moment = require('moment')
const { Op } = require('sequelize')
const bcryptjs = require("bcryptjs")
const sendMail = require('../../utils/send-mail')
const { generateJWT } = require('../../utils/generate-jwt')
const helpers = require('../../helpers')

module.exports = {
  verifyCode: async (body) => {
    const { userId, code, phoneNo } = body
    let user = await db.User.findOne({
      where: { id: userId, deletedAt: { [Op.eq]: null } },
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
        throw new Error('Code is expired.')
      }
      // remove the code and update the phoneNo
      await db.User.update(
        { otp: null, otpExpiry: null, phoneNo },
        { where: { id: user.id } }
      )
      await db.UserSetting.update({
        isPhoneVerified: true,
      }, { where: { userId } })
      return db.UserSetting.findOne({ where: { userId } })
    } else {
      throw Error('Invalid code.')
    }
  },
  logout: async (userId) => {
    return db.User.update({ fcmToken: null }, { where: { id: userId } })
  },
  signUp: async (body) => {
    const t = await db.sequelize.transaction()
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000)
      const { email, username, password, sex, dateOfBirth, height, weight, country, city, nationality, religiosity, education, skinColor, ethnicity, maritalStatus, language, tribe } = body
      let userExistByEmail = await db.User.findOne({ where: { email /* [Op.or]: [{ email }, { username }] */ } })
      if (userExistByEmail) {
        throw new Error("An account using this email already exists")
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt)
      const userCode = await helpers.generateUserCode(sex)
      let userCreated = await db.User.create({ email, username, password: hashedPassword, status: status.UNVERIFIED, otp: verificationCode, otpExpiry: new Date(), language, code: userCode }, { transaction: t })
      const { id: userId } = userCreated
      const profileCreated = await db.Profile.create({ userId, sex, dateOfBirth, height, weight, country, city, nationality, religiosity, education, skinColor, ethnicity, maritalStatus, tribe }, { transaction: t })
      await db.Wallet.create({ userId, amount: 0 }, { transaction: t })
      await db.UserSetting.create({ userId, isNotificationEnabled: true, isPremium: false, membership: membership.REGULAR, lastSeen: new Date() }, { transaction: t })
      await db.NotificationSetting.create({ userId }, { transaction: t })
      await t.commit()
      // send OTP or verification link
      helpers.sendAccountActivationLink(email, userCreated.id, verificationCode)
      // auth token
      userCreated = JSON.parse(JSON.stringify(userCreated))
      delete userCreated.password
      return { userCreated, profileCreated, JWTToken: generateJWT(userCreated) }
    } catch (error) {
      console.log(error);
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
          attributes: ['amount']
        },
        {
          model: db.UserSetting,
          attributes: ['isPremium', 'membership']
        },
        {
          model: db.Profile
        },
      ]
    })
    if (!user) {
      throw new Error('Incorrect email or password')
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Incorrect email or password')
    }
    // update fcmToken in db
    if (fcmToken) {
      await db.User.update({ fcmToken }, { where: { id: user.id } })
    }
    user = JSON.parse(JSON.stringify(user))
    delete user['password']
    const jwtPayload = { ...user }
    delete jwtPayload['Profile']
    delete jwtPayload['Wallet']
    const authToken = generateJWT(jwtPayload)
    user['authToken'] = authToken
    return user
  },
  activateAccount: async (userId, code) => {
    if (!userId || !code) return false
    const user = await db.User.findOne({ where: { id: userId } })
    if (user && user.otp == Number(code)) {
      if (user.tempEmail) { // update email case
        await db.User.update({ email: user.tempEmail, tempEmail: null, otp: null, status: status.ACTIVE }, { where: { id: userId } })
      } else {
        await db.User.update({ otp: null, status: status.ACTIVE }, { where: { id: userId } })
      }
      return true
    }
    return false
  },
  resetPassword: async (email) => {
    const user = await db.User.findOne({ where: { email }, attributes: { exclude: ['password'] } })
    if (!user) throw new Error('User does not Exist.')
    const jwtToken = generateJWT(user.toJSON())
    await db.PasswordReset.destroy({ where: { userId: user.id } })
    await db.PasswordReset.create({ userId: user.id })
    const resetPasswordLink = process.env.RESET_PASSWORD_PAGE + '?token=' + jwtToken
    const emailBody = `
      Please click on this link to reset your password  ${resetPasswordLink}
    `
    sendMail(email, "Password Reset Link", emailBody)
    return true
  },
  verifyPasswordResetLink: async (userId) => {
    const passwordResetLink = await db.PasswordReset.findOne({ where: { userId } })
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
  changePassword: async (body, userId) => {
    const { oldPassword, password } = body
    if (oldPassword && oldPassword !== '' && oldPassword !== null) { //  if old password is comming from frontend its means user is chaning password inside app not reset 
      // need to validate whether user inputted old password is correct or not
      const user = await db.User.findOne({ where: { id: userId } })
      if (!user) {
        throw new Error('User not found.')
      }
      const isCorrectPassword = await bcryptjs.compare(oldPassword, user.password)
      if (!isCorrectPassword) {
        throw new Error('You\'ve entered incorrect old password')
      }
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)
    await db.User.update({ password: hashedPassword }, { where: { id: userId } })
    await db.PasswordReset.destroy({ where: { userId } })
    return true
  },
}

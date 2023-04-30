const db = require('../../models')
const { roles, status } = require('../../config/constants')
const moment = require('moment')
const { Op } = require('sequelize')
const bcryptjs = require("bcryptjs")
const sendMail = require('../../utils/send-mail')
const { generateJWT } = require('../../utils/generate-jwt')
const helpers = require('../../helpers')

module.exports = {
  signUpOrSignInByEmail: async (body) => {
    const { email } = body
    const verificationCode = Math.floor(100000 + Math.random() * 900000)
    const userExist = await db.User.findOne({ where: { email, deletedAt: { [Op.eq]: null } } })
    if (userExist) {
      await db.User.update({ otp: verificationCode, otpExpiry: Date.now() }, { where: { id: userExist.id } })
      return db.User.findOne({ where: { id: userExist.id } });
    } else {
      try {
        return db.User.create({
          email,
          otp: verificationCode,
          otpExpiry: new Date(),
          role: roles.USER,
          status: status.INACTIVE,
        })
      } catch (error) {
        throw new Error(error.message)
      }
    }
  },
  verifyCode: async (body) => {
    const { email, code } = body
    let user = await db.User.findOne({
      where: { email, deletedAt: { [Op.eq]: null } },
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
      // remove the code
      await db.User.update(
        { otp: null, otpExpiry: null },
        { where: { id: user.id } }
      )
      // generate JWT
      user = user.toJSON()
      const dataForToken = { ...user }
      return { ...user, JWTToken: generateJWT(dataForToken) }
    } else {
      throw Error('Invalid code.')
    }
  },
  logout: async (userId) => {
    return db.User.update({ fcmToken: null }, { where: { id: userId } })
  },
  createProfile: async (body) => {
    const t = await db.sequelize.transaction()
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000)
      const { email, username, password, sex, dateOfBirth, height, weight, country, city, nationality, religiosity, education, skinColor, ethnicity, maritalStatus } = body
      let userExistByEmailOrUsername = await db.User.findOne({ where: { [Op.or]: [{ email }, { username }] } })
      if (userExistByEmailOrUsername) {
        throw new Error("User already exist with this email or username")
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt)
      const userCreated = await db.User.create({ email, username, password: hashedPassword, status: status.UNVERIFIED, otp: verificationCode }, { transaction: t })
      const profileCreated = await db.Profile.create({ userId: userCreated.id, sex, dateOfBirth, height, weight, country, city, nationality, religiosity, education, skinColor, ethnicity, maritalStatus }, { transaction: t })
      await t.commit()
      // send OTP or verification link
      helpers.sendAccountActivationLink(email, userCreated.id, verificationCode)
      return { userCreated, profileCreated }
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  login: async (body) => {
    const { email, password } = body
    let user = await db.User.findOne({ where: { email } })
    if (!user) {
      throw new Error('Incorrect email or password')
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Incorrect email or password')
    }
    // if (user.status === status.INACTIVE) {
    //   throw new Error('Your account is inactive')
    // }
    user = JSON.parse(JSON.stringify(user))
    delete user['password']
    const authToken = generateJWT(user)
    user['authToken'] = authToken
    return user
  },
  activateAccount: async (userId, code) => {
    if (!userId || !code) return false
    const user = await db.User.findOne({ where: { id: userId } })
    if (user && user.otp == Number(code)) {
      await db.User.update({ otp: null, status: status.ACTIVE }, { where: { id: userId } })
      return true
    }
    return false
  },
}

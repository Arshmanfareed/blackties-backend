const db = require('../../models')
const { roles, status } = require('../../config/constants')
const moment = require('moment')
const { generateJWT } = require('../../utils/generate-jwt')
const { Op } = require('sequelize')

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
      // include: [
      //   {
      //     model: db.Profile
      //   },
      //   {
      //     model: db.UserMedia,
      //     required: false,
      //     attributes: ['id', 'url', 'thumbUrl', 'type', 'sequence'],
      //     where: {
      //       status: true
      //     }
      //   },
      // ]
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
      // delete dataForToken['Profile']
      // delete dataForToken['UserMedia']
      return { ...user, JWTToken: generateJWT(dataForToken) }
    } else {
      throw Error('Invalid code.')
    }
  },
  logout: async (userId) => {
    return db.User.update({ fcmToken: null }, { where: { id: userId } })
  }
}

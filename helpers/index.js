const { sequelize } = require('../models')
const db = require('../models')
const { Op, Sequelize, QueryTypes } = require('sequelize')
const sendMail = require('../utils/send-mail')
const { gender } = require('../config/constants')

const helperFunctions = {
  sendAccountActivationLink: async (email, userId, activationCode) => {
    // const activationLink = process.env.PAGES_LINK + "accountActivation.html?userId=" + userId + "&code=" + activationCode
    const activationLink = process.env.BASE_URL_LOCAL + "/auth/account-activation/" + userId + "/" + activationCode
    const emailBody = `
      Please click on this link to activate your account ${activationLink}
    `
    sendMail(email, "Email Verification Link", emailBody)
  },
  generateUserCode: async (sex) => {
    const lastUser = await db.User.count({
      include: {
        model: db.Profile,
        where: {
          sex
        },
      },
    })
    const userCode = sex == gender.MALE ? 'M' + (Number(lastUser + 1)) : 'F' + (Number(lastUser + 1));
    return userCode
  },
  createMatchIfNotExist: async (requesterUserId, requesteeUserId, t) => {
    const matchExist = await db.Match.findOne({
      where: {
        [Op.or]: [
          { userId: requesterUserId, otherUserId: requesteeUserId }, // either match b/w user1 or user2
          { userId: requesteeUserId, otherUserId: requesterUserId } // or match b/w user2 or user1 
        ]
      }
    })
    if (!matchExist) {
      await db.Match.create({ userId: requesterUserId, otherUserId: requesteeUserId, status: true }, { transaction: t })
    }
    return true
  },
}

module.exports = helperFunctions

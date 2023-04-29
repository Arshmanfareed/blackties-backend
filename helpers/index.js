const { sequelize } = require('../models')
const db = require('../models')
const { Op, Sequelize, QueryTypes } = require('sequelize')
const sendMail = require('../utils/send-mail')

const helperFunctions = {
  sendAccountActivationLink: async (email, userId, activationCode) => {
    // const activationLink = process.env.PAGES_LINK + "accountActivation.html?userId=" + userId + "&code=" + activationCode
    const activationLink = process.env.BASE_URL_LOCAL + "/auth/account-activation/" + userId + "/" + activationCode
    const emailBody = `
      Please click on this link to activate your account ${activationLink}
    `
    sendMail(email, "Email Verification Link", emailBody)
  }
}

module.exports = helperFunctions

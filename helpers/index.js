const { sequelize } = require('../models')
const db = require('../models')
const { Op, Sequelize, QueryTypes } = require('sequelize')
// const sendMail = require('../utils/send-mail')
const sendMail = require('../utils/sendgrid-mail')
const { translate } = require('../utils/translation')

const helperFunctions = {
  sendAccountActivationLink: async (email, userId, activationCode, lang = 'en') => {
    // const activationLink = process.env.PAGES_LINK + "accountActivation.html?userId=" + userId + "&code=" + activationCode
    const activationLink = process.env.BASE_URL_LOCAL + "/auth/account-activation/" + userId + "/" + activationCode
    // const emailBody = `
    //   Please click on this link to activate your account ${activationLink}
    // `
    // sendMail(email, "Email Verification Link", emailBody)
    const templatedId = process.env.EMAIL_VERIFY_TEMPLATE_ID
    const dynamicParams = {
      message: translate('emailVerificationBody', lang), //`Please click on this link to activate your account`,
      link: activationLink
    }
    sendMail(templatedId, email, translate('emailVerificationSubject', lang), dynamicParams)
  },
}

module.exports = helperFunctions

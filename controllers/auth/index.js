const authService = require('../../services/auth/auth')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { authValidations } = require('../../validations')
const fs = require('fs')

module.exports = {
  signUp: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validateCreateProfile(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.signUp(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._201(res, data, 'Profile created successfully')
  },
  verifyCode: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validateVerifyCode(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.verifyCode(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'OTP verified successfully')
  },
  login: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validateLogin(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.login(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Login successfully')
  },
  logout: async (req, res) => {
    const { id } = req.user
    const [err, data] = await to(authService.logout(id))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Logout successfully')
  },
  activateAccount: async (req, res) => {
    const { userId, code } = req.params
    const [err, data] = await to(authService.activateAccount(userId, code))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    const pageUrl = data ? process.env.ACCOUNT_ACTIVATION_SUCCESS : process.env.ACCOUNT_ACTIVATION_FAILURE;
    return res.redirect(pageUrl)
  },
}

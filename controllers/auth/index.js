const authService = require('../../services/auth/auth')
const { to, throwError } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { sendSMS } = require('../../utils/send-sms')
const { authValidations } = require('../../validations')

module.exports = {
  signUpOrSignInByEmail: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validatesignUpOrSignInByEmail(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.signUpOrSignInByEmail(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    const { id, email, status, otp } = data
    // sending verification code
    responseFunctions._201(
      res,
      { id, email, status, otp },
      'OTP send successfully'
    )
    // send OTP on Email
    // await sendSMS(phoneNo, otp)
  },
  createProfile: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validateCreateProfile(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.createProfile(body))
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
}

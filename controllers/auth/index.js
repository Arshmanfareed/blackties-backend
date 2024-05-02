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
    return responseFunctions._200(res, data, 'Your phone number has been successfully updated')
  },

  updateLanguage: async (req, res) => {
    // validation
    const { body } = req

    if (body.userId) {
      body.userId = parseInt(body.userId);
    }
    // console.log("userid------------------------------------", body.language)

    if (!body || !body.userId || !body.language) {
        return responseFunctions._400(res, "Missing required fields");
    }
    
    const { error } = authValidations.validateUpdateLanguage(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.UpdateLanguage(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, `Your language has been successfully updated ${body.language}`)
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
  resetPassword: async (req, res) => {
    const { body } = req
    const { error } = authValidations.validateResetPassword(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const { email } = body
    const [err, data] = await to(authService.resetPassword(email))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Reset password link has been sent to your email.')
  },
  emailConfirm: async (req, res) => {
    const { body } = req
    // const { error } = authValidations.validateResetPassword(body)
    // if (error) {
    //   return responseFunctions._400(res, error.details[0].message)
    // }
    const { email } = body
    const [err, data] = await to(authService.emailConfirm(email))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Confirmation link has been sent to your email.')
  },
  verifyPasswordResetLink: async (req, res) => {
    const { id } = req.user
    const [err, data] = await to(authService.verifyPasswordResetLink(id))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully.')
  },
  changePassword: async (req, res) => {
    const { id } = req.user
    const { body } = req
    const { error } = authValidations.validateChangePassword(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.changePassword(body, id))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Password updated successfully.')
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
    const pageUrl = data.success ? `${process.env.ACCOUNT_ACTIVATION_SUCCESS}?email=${data?.user?.email}` : process.env.ACCOUNT_ACTIVATION_FAILURE;
    return res.redirect(pageUrl)
  },
  deactivateAccount: async (req, res) => {
    const { id } = req.user
    const { body } = req
    const { error } = authValidations.validateDeactivateAccount(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.deactivateAccount(id, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Account deactivated successfully')
  },
  reactivateAccount: async (req, res) => {
    const { body } = req
    const [err, data] = await to(authService.reactivateAccount(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Account reactivated successfully')
  },
}

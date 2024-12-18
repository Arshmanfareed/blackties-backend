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
  resendOTP: async (req, res) => {
    // validation
    const { body } = req
    const { error } = authValidations.validateresendOTP(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.resendOTP(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'An email has been sent to your email successfully')
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
    return responseFunctions._200(res, data, 'Your email has been successfully verified')
  },

  updateLanguage: async (req, res) => {
    const { body } = req

    if (body.userId) {
      body.userId = parseInt(body.userId);
    }

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
  findEmail: async (req, res) => {
    const { body } = req
    
    if(body.email) {
        body.email = body.email.trim();
    }

    if (!body || !body.email) {
        return responseFunctions._400(res, "Missing required fields");
    }
    
    const { error } = authValidations.validatefindEmail(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.findEmail(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, `You enter perfect email`)
  },

  updateCurrency: async (req, res) => {
    const { body } = req

    if (body.userId) {
      body.userId = parseInt(body.userId);
    }

    if (!body || !body.userId || !body.currency) {
        return responseFunctions._400(res, "Missing required fields");
    }
  
    
    const { error } = authValidations.validateUpdateCurrency(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(authService.UpdateCurrency(body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, `Your currency has been successfully updated ${body.currency}`)
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

  autoVerificationLogin: async (req, res) => {
    const { id } = req.user
    const authToken = req.header('x-auth-token')
    const [err, data] = await to(authService.autoVerificationLogin(id, authToken))
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
    if(data.success){
      const pageUrl = `${process.env.ACCOUNT_ACTIVATION_SUCCESS}?email=${data?.user?.email}&authToken=${data?.user?.authToken}`;
      // return responseFunctions._200(res, pageUrl, 'ACCOUNT_ACTIVATION_SUCCESS')
      return res.redirect(pageUrl)
    }else{
      const pageUrl = process.env.ACCOUNT_ACTIVATION_FAILURE;
      return res.redirect(pageUrl)
      // return responseFunctions._200(res, pageUrl, 'ACCOUNT_ACTIVATION_FAILURE')
    }
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

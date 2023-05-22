const userService = require('../../services/user/user')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')

module.exports = {
  requestContactDetails: async (req, res) => {
    const { id: requesteeUserId } = req.params
    const { id: requesterUserId } = req.user
    const [err, data] = await to(userService.requestContactDetails(requesterUserId, requesteeUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
  blockUser: async (req, res) => {
    const { user, params, body } = req
    const { id: blockedUserId } = params
    const { id: blockerUserId } = user
    const { error } = userValidations.validateBlockUser(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const { reason } = body
    const [err, data] = await to(userService.blockUser(blockerUserId, blockedUserId, reason))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User blocked successfully')
  },
  unblockUser: async (req, res) => {
    const { user, params } = req
    const { id: blockedUserId } = params
    const { id: blockerUserId } = user
    const [err, data] = await to(userService.unblockUser(blockerUserId, blockedUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User unblocked successfully')
  },
  getListOfBlockedUsers: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getListOfBlockedUsers(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  requestPicture: async (req, res) => {
    const { id: requesterUserId } = req.user
    const { id: requesteeUserId } = req.params
    const [err, data] = await to(userService.requestPicture(requesterUserId, requesteeUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
}

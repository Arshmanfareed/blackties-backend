const userService = require('../../services/user/user')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')
const { requestStatus } = require('../../config/constants')

module.exports = {
  requestContactDetails: async (req, res) => {
    const { id: requesteeUserId } = req.params
    const { id: requesterUserId } = req.user
    const { body } = req
    const { error } = userValidations.validateRequestContactDetails(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.requestContactDetails(requesterUserId, requesteeUserId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
  respondToContactDetailsRequest: async (req, res) => {
    const { id: requestId } = req.params
    const { body } = req
    const { error } = userValidations.validateRespondToRequestContactDetails(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.respondToContactDetailsRequest(requestId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Responded on request successfully')
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
  updatePictureRequest: async (req, res) => {
    const { file, body } = req
    const { id: requestId } = req.params
    const { error } = userValidations.validateUpdatePictureRequest(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    if (body?.status === requestStatus.ACCEPTED && !file) {
      return responseFunctions._400(res, 'Image is required.')
    }
    const dataToUpdate = {
      ...body
    }
    if (file) {
      dataToUpdate['imageUrl'] = file.location
      dataToUpdate['isViewed'] = false
    }
    const [err, data] = await to(userService.updatePictureRequest(requestId, dataToUpdate))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request updated successfully')
  },
  getUserNotifications: async (req, res) => {
    const { id: userId } = req.user
    const { limit, offset, status } = req.query
    const [err, data] = await to(userService.getUserNotifications(userId, Number(limit || 10), Number(offset || 0), status))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getMyRequestOfContactDetails: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getMyRequestOfContactDetails(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getIncomingRequestOfContactDetails: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getIncomingRequestOfContactDetails(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  usersWhoViewedMyPicture: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.usersWhoViewedMyPicture(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getUsersWhoRejectedMyProfile: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getUsersWhoRejectedMyProfile(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getProfilesRejectedByMe: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getProfilesRejectedByMe(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  cancelMatch: async (req, res) => {
    const { id: userId } = req.user
    const { id: otherUserId } = req.params
    const [err, data] = await to(userService.cancelMatch(userId, otherUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  markNotificationAsReadOrUnread: async (req, res) => {
    const { body } = req
    const { id: notificationIds, status } = body
    const { error } = userValidations.validateUpdateNotification(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.markNotificationAsReadOrUnread(notificationIds, status))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  addSeenToUserProfile: async (req, res) => {
    const { id: viewerId } = req.user
    const { id: viewedId } = req.params
    const [err, data] = await to(userService.addSeenToUserProfile(viewerId, viewedId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Seen added successfully')
  },
  getUsersWhoSeenMyProfile: async (req, res) => {
    const { id: userId } = req.user
    const { limit, offset } = req.query
    const [err, data] = await to(userService.getUsersWhoSeenMyProfile(userId, Number(limit || 10), Number(offset || 0)))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
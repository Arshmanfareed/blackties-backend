const userService = require('../../services/user/user')
const { to } = require('../../utils/error-handler')
const responseFunctions = require('../../utils/responses')
const { userValidations } = require('../../validations')
const { requestStatus } = require('../../config/constants')

module.exports = {
  requestContactDetails: async (req, res) => {
    const { id: requesteeUserId } = req.params
    const { id: requesterUserId, countBasedFeature } = req.user
    const { body } = req
    const { error } = userValidations.validateRequestContactDetails(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.requestContactDetails(requesterUserId, requesteeUserId, body, countBasedFeature))
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
  reSendContactDetails: async (req, res) => {
    const { id: requestId } = req.params
    const { body } = req
    const { error } = userValidations.validateRespondToRequestContactDetails(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.reSendContactDetails(requestId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Responded on request successfully')
  },
  cancelContactDetails: async (req, res) => {
    const { id: requestId } = req.params
    
    const [err, data] = await to(userService.cancelContactDetails(requestId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Responded on request successfully')
  },
  blockUser: async (req, res) => {
    const { user, params, body } = req
    const { id: blockedUserId } = params
    const { id: blockerUserId } = user

    const ip = req.body.ip;
      
    const { error } = userValidations.validateBlockUser(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const { reason } = body
    const [err, data] = await to(userService.blockUser(blockerUserId, blockedUserId, reason, ip))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, `User blocked successfully ${ip}`)
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
    const { id: requesterUserId, countBasedFeature } = req.user
    const { id: requesteeUserId } = req.params
    const [err, data] = await to(userService.requestPicture(requesterUserId, requesteeUserId, countBasedFeature))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
  viewPicture: async (req, res) => {
    const { id: requesterUserId } = req.user
    const { id: requesteeUserId } = req.params
    const [err, data] = await to(userService.viewPicture(requesterUserId, requesteeUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Picture viewed successfully')
  },
  updateSubscription: async (req, res) => {
    const { name, gender, duration, currency, price, productId } = req.query;
    // const { price, productId } = req.query;
    const [err, data] = await to(userService.updateSubscription(name, gender, duration, currency, price, productId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Plan update successfully')
  },
  updatePictureRequest: async (req, res) => {
    const { id: requesterUserId } = req.user
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
      dataToUpdate['pictureSentUserId'] = requesterUserId
    }
    const [err, data] = await to(userService.updatePictureRequest(requestId, dataToUpdate))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request updated successfully')
  },
  getUserNotifications: async (req, res) => {
    
    const { id: userId } = req.user
    // console.log('asdsad', req);
    // return 'error';
    const { limit, offset, status } = req.query
    const [err, data] = await to(userService.getUserNotifications(userId, Number(limit || 10), Number(offset || 0), status))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },

  // getUserPeriodicNotifications: async (req, res) => {
  //   const { id: userId } = req.user
  //   const { limit, offset, status } = req.query
  //   const [err, data] = await to(userService.getUserPeriodicNotifications(userId, Number(limit || 10), Number(offset || 0), status))
  //   if (err) {
  //     return responseFunctions._400(res, err.message)
  //   }
  //   return responseFunctions._200(res, data, 'Data fetched successfully')
  // },
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
  requestExtraInfo: async (req, res) => {
    const { body, user, params } = req
    const { id: requesterUserId, countBasedFeature } = user
    const { id: requesteeUserId } = params
    const [err, data] = await to(userService.requestExtraInfo(requesterUserId, requesteeUserId, body, countBasedFeature))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request sent successfully')
  },
  acceptOrRejectExtraInfoRequest: async (req, res) => {
    const { body, user, params } = req
    const { id: requestId } = params
    const { status, questions } = body
    const [err, data] = await to(userService.acceptOrRejectExtraInfoRequest(requestId, status, questions))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request responded successfully')
  },
  userDataEmpty: async (req, res) => {
    const { params } = req
    const { id: userId } = params
    const [err, data] = await to(userService.userDataEmpty(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'User Empty successfully')
  },
  answerToQuestion: async (req, res) => {
    const { body, params } = req
    const { id: questionId } = params
    const { answer } = body
    const { error } = userValidations.validateAnswerToQuestion(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.answerToQuestion(questionId, answer))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Answer submitted successfully')
  },
  cancelQuestion: async (req, res) => {
    const { body, user, params } = req
    const { id: requestId } = params
    const [err, data] = await to(userService.cancelQuestion(requestId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Request responded successfully')
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
  getUsersIRequestedMoreInfoFrom: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getUsersIRequestedMoreInfoFrom(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getUsersWhoRequestedMoreInfoFromMe: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getUsersWhoRequestedMoreInfoFromMe(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  updateUser: async (req, res) => {
    const { id: userId } = req.user
    const { body } = req
    const { error } = userValidations.validateUpdateUser(body)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.updateUser(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Details updated successfully')
  },
  getUserWalletAndMembership: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getUserWalletAndMembership(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getNotificationToggles: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getNotificationToggles(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  updateNotificationToggles: async (req, res) => {
    const { id: userId } = req.user
    const { body } = req
    const [err, data] = await to(userService.updateNotificationToggles(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Notification setting updated.')
  },
  sendPushNotification: async (req, res) => {
    const { id: userId } = req.params
    const { body } = req
    const [err, data] = await to(userService.sendPushNotification(userId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Notification sent successfully.')
  },
  createNotification: async (req, res) => {
    const { id: userId } = req.user
    const { id: otherUserId } = req.params
    const { body } = req
    const [err, data] = await to(userService.createNotification(userId, otherUserId, body))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Notification created successfully.')
  },
  getFileContentFromS3: async (req, res) => {
    const { query } = req
    const { filename } = query
    const { error } = userValidations.validateGetFileFromS3(query)
    if (error) {
      return responseFunctions._400(res, error.details[0].message)
    }
    const [err, data] = await to(userService.getFileContentFromS3(filename))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully.')
  },
  getTransformedFileFromS3: async (req, res) => {
    const [err, data] = await to(userService.getTransformedFileFromS3())
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully.')
  },
  getUserExtraInfoRequest: async (req, res) => {
    const { loggedInUserId } = req.query
    const { id: otherUserId } = req.params
    const [err, data] = await to(userService.getUserExtraInfoRequest(loggedInUserId, otherUserId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
  getMyRequestOfPicture: async (req, res) => {
    const { id: userId } = req.user
    const [err, data] = await to(userService.getMyRequestOfPicture(userId))
    if (err) {
      return responseFunctions._400(res, err.message)
    }
    return responseFunctions._200(res, data, 'Data fetched successfully')
  },
}
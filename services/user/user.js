const { requestStatus, gender, notificationType, socketEvents } = require('../../config/constants')
const helperFunctions = require('../../helpers')
const db = require('../../models')
const { Op, Sequelize } = require('sequelize')
const pushNotification = require('../../utils/push-notification')
const socketFunctions = require('../../socket')
const bcryptjs = require("bcryptjs")
const common = require('../../helpers/common')
const { to } = require('../../utils/error-handler')
const sendSms = require('../../utils/send-sms')
const { readFileFromS3 } = require('../../utils/read-file')
const csvtojsonV2 = require("csvtojson");

module.exports = {
  requestContactDetails: async (requesterUserId, requesteeUserId, body, countBasedFeature) => {
    /*
      You will not be able to request the contact details of another user, unless you cancel the present request
      You will need to wait at least 24 hours to be able to cancel this request
    */
    const t = await db.sequelize.transaction()
    try {
      const { requesterName, requesterMessage, name, personToContact, nameOfContact, phoneNo, message, isFromFemale } = body
      const notificationPayload = {
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        status: false
      }
      // check wheteher requesterUserId have cancelled the match with requesteeUserId before
      const matchCancelled = await db.Match.findOne({
        where: {
          [Op.or]: [
            { userId: requesterUserId, otherUserId: requesteeUserId, }, // either match b/w user1 or user2
            { userId: requesteeUserId, otherUserId: requesterUserId }, // or match b/w user2 or user1 
          ],
          isCancelled: true,
          // cancelledBy: requesteeUserId
        }
      })
      if (matchCancelled && matchCancelled.cancelledBy == requesteeUserId) {
        throw new Error('This match has been cancelled, you cannot request contact details again.')
      }

      // check for already requested
      const alreadyRequested = await db.ContactDetailsRequest.findOne({
        where: {
          requesterUserId,
          requesteeUserId,
          status: [requestStatus.PENDING, requestStatus.ACCEPTED],
        },
        order: [['id', 'DESC']],
      })
      if (
        alreadyRequested &&
        (alreadyRequested.status == requestStatus.PENDING && matchCancelled ||
          alreadyRequested.status == requestStatus.ACCEPTED && !matchCancelled)
      ) {
        throw new Error('Request already exist.')
      }
      const request = await db.ContactDetailsRequest.create({
        requesterUserId,
        requesteeUserId,
        name: requesterName,
        message: requesterMessage,
        status: requestStatus.PENDING,
        isFromFemale,
      }, { transaction: t })
      let contactDetailsByFemale;
      if (isFromFemale) {
        /*
          Please confirm you want to send your contact details of this user
          Notes
          Your contact details will not be shown to him unless he accepts your request.
          You will not be able to send your contact details to another user, unless you cancel the present request.
          You will need to wait at least 24 hours to be able to cancel this request.
        */
        contactDetailsByFemale = await db.ContactDetails.create({
          contactDetailsRequestId: request.id,
          name,
          personToContact,
          nameOfContact,
          phoneNo,
          message,
          status: false
        }, { transaction: t })
        notificationPayload['notificationType'] = notificationType.CONTACT_DETAILS_SENT
      } else {
        notificationPayload['notificationType'] = notificationType.CONTACT_DETAILS_REQUEST
      }
      // generate notification
      let notification = await db.Notification.create(notificationPayload, { transaction: t })
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', { by: 1, where: { id: countBasedFeature.id }, transaction: t })
      }
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(notificationPayload.userId, requesterUserId, 'contactDetailsRequest')
      if (isToggleOn) { // check for toggles on or off
        const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
      }
      const socketData = {
        request,
        contactDetailsByFemale,
      }
      const eventName = isFromFemale ? socketEvents.CONTACT_DETAILS_SENT : socketEvents.CONTACT_DETAILS_REQUEST;
      // sending contact details request on socket
      socketFunctions.transmitDataOnRealtime(eventName, requesteeUserId, socketData)
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, requesteeUserId, notification)
      return request
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  respondToContactDetailsRequest: async (requestId, body) => {
    const t = await db.sequelize.transaction()
    try {
      let contactDetailsRequest = await db.ContactDetailsRequest.findOne({ where: { id: requestId } })
      if (contactDetailsRequest.status !== requestStatus.PENDING) {
        throw new Error("You've already responded to this request")
      }
      /*
        either accept or reject  
      */
      const { name, personToContact, nameOfContact, phoneNo, message, status, isFemaleResponding } = body
      /*
        Are you sure you want to match with this user?
        Note: All other pending incoming requests will be cancelled
      */
      const requestUpdatePayload = {}
      let notification, contactDetailsByFemale;
      const { requesterUserId, requesteeUserId } = contactDetailsRequest
      const notificationPayload = {
        userId: requesterUserId,
        resourceId: requesteeUserId,
        resourceType: 'USER',
        status: false
      }
      if (status === requestStatus.ACCEPTED) { // accepted
        requestUpdatePayload['status'] = requestStatus.ACCEPTED
        if (isFemaleResponding) {
          contactDetailsByFemale = await db.ContactDetails.create({
            contactDetailsRequestId: requestId,
            name,
            personToContact,
            nameOfContact,
            phoneNo,
            message,
            status: true
          }, { transaction: t })
        }
        // if accept a match is created between these two users
        if (!isFemaleResponding) {
          await db.ContactDetails.update({ status: true }, { where: { contactDetailsRequestId: requestId } })
        }
        await helperFunctions.createMatchIfNotExist(requesterUserId, requesteeUserId, t)
        // generate notification of match
        notificationPayload['notificationType'] = notificationType.MATCH_CREATED
        notification = await db.Notification.create(notificationPayload, { transaction: t })
        // push notification
        const isToggleOn = await helperFunctions.checkForPushNotificationToggle(notificationPayload.userId, requesteeUserId, 'getMatched')
        if (isToggleOn) { // check for toggles on or off
          const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
          pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
        }
      } else { // rejected 
        requestUpdatePayload['status'] = requestStatus.REJECTED
        notificationPayload['notificationType'] = contactDetailsRequest.isFromFemale ? notificationType.CONTACT_DETAILS_SENT_REJECTED : notificationType.CONTACT_DETAILS_REQUEST_REJECTED
        // generate notification of reject
        notification = await db.Notification.create(notificationPayload, { transaction: t })
      }
      await db.ContactDetailsRequest.update(requestUpdatePayload, { where: { id: requestId }, transaction: t })
      await t.commit()
      contactDetailsRequest = JSON.parse(JSON.stringify(contactDetailsRequest))
      contactDetailsRequest['status'] = requestUpdatePayload['status']
      const socketData = { contactDetailsRequest, contactDetailsByFemale }
      // sending respond of contact details request on socket
      socketFunctions.transmitDataOnRealtime(socketEvents.CONTACT_DETAILS_RESPOND, requesterUserId, socketData)
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, requesterUserId, notification)
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  blockUser: async (blockerUserId, blockedUserId, reasons) => {
    const alreadyBlocked = await db.BlockedUser.findOne({ where: { blockerUserId, blockedUserId } })
    if (alreadyBlocked) {
      throw new Error("You've already blocked this user.")
    }
    const blockedUser = await db.BlockedUser.create({ blockerUserId, blockedUserId, status: true })
    const blockedReasons = reasons.map(reason => { return { reason, blockedId: blockedUser.id, status: true } })
    await db.BlockReason.bulkCreate(blockedReasons)
    helperFunctions.autoSuspendUserOnBlocks(blockedUserId) // suspend user on lot of blocks
    return blockedUser
  },
  unblockUser: async (blockerUserId, blockedUserId) => {
    return db.BlockedUser.destroy({ where: { blockerUserId, blockedUserId } })
  },
  getListOfBlockedUsers: async (blockerUserId) => {
    return db.BlockedUser.findAll({
      where: { blockerUserId },
      attributes: [],
      include: {
        model: db.User,
        as: 'blockedUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${blockerUserId} AND savedUserId = blockedUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership'],
          },
        ]
      }
    })
  },
  requestPicture: async (requesterUserId, requesteeUserId, countBasedFeature) => {
    const t = await db.sequelize.transaction()
    try {
      // const alreadyRequested = await db.PictureRequest.findOne({ where: { requesterUserId, requesteeUserId, status: requestStatus.PENDING } })
      // if (alreadyRequested) {
      //   throw new Error("you've already requested picture to this user.")
      // }
      // create picture request
      let pictureRequest = await db.PictureRequest.create({ requesterUserId, requesteeUserId, status: requestStatus.PENDING }, { transaction: t })
      // create notification and notifiy other user about request
      let notification = await db.Notification.create({
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        notificationType: notificationType.PICTURE_REQUEST,
        status: 0
      }, { transaction: t })
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', { by: 1, where: { id: countBasedFeature.id }, transaction: t })
      }
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(requesteeUserId, requesterUserId, 'receivePictureRequest')
      if (isToggleOn) { // check for toggles on or off
        const { fcmToken } = await db.User.findOne({ where: { id: requesteeUserId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationType.PICTURE_REQUEST, notificationType.PICTURE_REQUEST)
      }
      const requesterUser = await db.User.findOne({
        where: { id: requesterUserId },
        attributes: ['username', 'code'],
      })
      pictureRequest = JSON.parse(JSON.stringify(pictureRequest))
      pictureRequest['requesterUser'] = requesterUser
      // sending picture request on socket
      socketFunctions.transmitDataOnRealtime(socketEvents.PICTURE_REQUEST, requesteeUserId, pictureRequest)
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, requesteeUserId, notification)
      return pictureRequest
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  updatePictureRequest: async (requestId, dataToUpdate) => {
    // update picture request
    await db.PictureRequest.update(dataToUpdate, { where: { id: requestId } })
    const updatedRequest = await db.PictureRequest.findOne({ where: { id: requestId } })
    const notificationPayload = {
      userId: updatedRequest.requesterUserId,
      resourceId: updatedRequest.requesteeUserId,
      resourceType: 'USER',
      status: 0
    }
    const recipientUserId = updatedRequest.requesterUserId;
    if (dataToUpdate?.status === requestStatus.ACCEPTED) {
      notificationPayload['notificationType'] = notificationType.PICTURE_SENT
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(notificationPayload.userId, notificationPayload.resourceId, 'receivePicture')
      if (isToggleOn) { // check for toggles on or off
        const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
      }
    } else if (dataToUpdate?.status === requestStatus.REJECTED) {
      notificationPayload['notificationType'] = notificationType.PICTURE_REQUEST_REJECTED
    } else {
      // picture is viewed by the targetted user
      socketFunctions.transmitDataOnRealtime(socketEvents.PICTURE_REQUEST_RESPOND, updatedRequest.requesteeUserId, dataToUpdate)
      return true
    }
    // create notification and notifiy user about request accept or reject status
    let notification = await db.Notification.create(notificationPayload)
    socketFunctions.transmitDataOnRealtime(socketEvents.PICTURE_REQUEST_RESPOND, recipientUserId, dataToUpdate)
    // sending notification on socket
    notification = JSON.parse(JSON.stringify(notification))
    const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
    notification['User'] = userNameAndCode
    socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, recipientUserId, notification)
    return true
  },
  getUserNotifications: async (userId, limit, offset, queryStatus) => {
    return db.Notification.findAndCountAll({
      limit,
      offset,
      where: {
        userId,
        status: queryStatus || [0, 1],
      },
      attributes: ['id', 'resourceId', 'resourceType', 'notificationType', 'status', 'createdAt'],
      include: {
        model: db.User,
        attributes: ['username', 'code'],
      },
      order: [['id', 'desc']],
    })
  },
  getMyRequestOfContactDetails: async (userId) => {
    return db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesterUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED
        },
      },
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
  },
  getIncomingRequestOfContactDetails: async (userId) => {
    const user = await db.User.findOne({ where: { id: userId }, include: { model: db.Profile } })
    const whereFilter = {
      requesteeUserId: userId,
      status: {
        [Op.ne]: requestStatus.REJECTED
      },
    }
    if (user.Profile.sex == gender.FEMALE) {
      whereFilter['isFromFemale'] = false
    } else {
      whereFilter['isFromFemale'] = true
    }
    return db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: whereFilter,
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
  },
  usersWhoViewedMyPicture: async (userId) => {
    return db.PictureRequest.findAll({
      attributes: ['id', 'requesterUserId', 'requesteeUserId', 'isViewed'],
      where: {
        requesteeUserId: userId,
        isViewed: true,
        imageUrl: {
          [Op.ne]: null,
        }
      },
      include: {
        model: db.User,
        as: 'pictureRequesterUser',
        attributes: [
          'id',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = pictureRequesterUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      },
    })
  },
  getUsersWhoRejectedMyProfile: async (userId) => {
    let rejectedContactDetails = await db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesterUserId: userId,
        status: requestStatus.REJECTED,
      },
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
    return rejectedContactDetails
  },
  getProfilesRejectedByMe: async (userId) => {
    let rejectedContactDetails = await db.ContactDetailsRequest.findAll({
      attributes: ['id', 'status', 'requesterUserId', 'requesteeUserId'],
      where: {
        requesteeUserId: userId,
        status: requestStatus.REJECTED,
      },
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
    return rejectedContactDetails
  },
  cancelMatch: async (userId, otherUserId) => {
    const matchExist = await db.Match.findOne({
      where: {
        [Op.or]: [
          { userId, otherUserId, }, // either match b/w user1 or user2
          { userId: otherUserId, otherUserId: userId }, // or match b/w user2 or user1 
        ],
        isCancelled: false
      }
    })
    if (!matchExist) {
      throw new Error('Match does not exist.')
    }
    await db.Match.update({ isCancelled: true, cancelledBy: userId }, {
      where: {
        id: matchExist.id
      }
    })
    await db.Notification.create({
      userId: otherUserId,
      resourceId: userId,
      resourceType: 'USER',
      notificationType: notificationType.MATCH_CANCELLED,
      status: false,
    })
    // push notification
    const isToggleOn = await helperFunctions.checkForPushNotificationToggle(otherUserId, userId, 'matchCancelled')
    if (isToggleOn) { // check for toggles on or off
      const { fcmToken } = await db.User.findOne({ where: { id: otherUserId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationType.MATCH_CANCELLED, notificationType.MATCH_CANCELLED)
    }
    return true
  },
  markNotificationAsReadOrUnread: async (notificationIds, status) => {
    return db.Notification.update({ status }, {
      where: { id: notificationIds }
    })
  },
  requestExtraInfo: async (requesterUserId, requesteeUserId, body, countBasedFeature) => {
    const { questions } = body
    const t = await db.sequelize.transaction()
    try {
      let extraInfoRequest = await db.ExtraInfoRequest.findOne({
        where: {
          [Op.or]: [
            { requesterUserId, requesteeUserId },
            { requesterUserId: requesteeUserId, requesteeUserId: requesterUserId },
          ],
        },
        order: [['id', 'DESC']]
      })
      if (extraInfoRequest &&
        extraInfoRequest.requesterUserId === requesterUserId &&
        extraInfoRequest.status === requestStatus.REJECTED
      ) {
        throw new Error('your request was previously rejected.')
      }
      if (!extraInfoRequest || (extraInfoRequest && extraInfoRequest.status === requestStatus.REJECTED)) {
        extraInfoRequest = await db.ExtraInfoRequest.create({
          requesterUserId,
          requesteeUserId,
          status: requestStatus.PENDING
        }, { transaction: t })
      }
      // create question
      const askedQuestions = []
      for (let questionObj of questions) {
        // create user asked question
        const { category, question } = questionObj
        const questionCreated = await db.UserQuestionAnswer.create({
          extraInfoRequestId: extraInfoRequest.id,
          askingUserId: requesterUserId,
          askedUserId: requesteeUserId,
          category,
          question,
          requesterUserId,
          requesteeUserId,
          status: false
        }, { transaction: t })
        askedQuestions.push(questionCreated)
      }
      // create notification
      let notification = await db.Notification.create({
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        notificationType: notificationType.QUESTION_RECEIVED,
        status: 0
      }, { transaction: t })
      // decrement count  by 1 if user uses count based feature
      if (countBasedFeature) {
        await db.UserFeature.decrement('remaining', { by: 1, where: { id: countBasedFeature.id }, transaction: t })
      }
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(requesteeUserId, requesterUserId, 'receiveQuestion')
      if (isToggleOn) { // check for toggles on or off
        const { fcmToken } = await db.User.findOne({ where: { id: requesteeUserId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationType.QUESTION_RECEIVED, notificationType.QUESTION_RECEIVED)
      }
      // sending extra info request and question on socket
      const socketData = { extraInfoRequest, askedQuestions }
      socketFunctions.transmitDataOnRealtime(socketEvents.QUESTION_RECEIVED, requesteeUserId, socketData)
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, requesteeUserId, notification)
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  acceptOrRejectExtraInfoRequest: async (requestId, status) => {
    const { ACCEPTED, REJECTED } = requestStatus
    const updateStatus = status === ACCEPTED ? ACCEPTED : REJECTED;
    const t = await db.sequelize.transaction()
    try {
      await db.ExtraInfoRequest.update({ status: updateStatus }, { where: { id: requestId }, transaction: t })
      const updatedRequest = await db.ExtraInfoRequest.findOne({ where: { id: requestId } })
      if (status === REJECTED) { // notification for rejected request
        let notification = await db.Notification.create({
          userId: updatedRequest.requesterUserId,
          resourceId: updatedRequest.requesteeUserId,
          resourceType: 'USER',
          notificationType: notificationType.EXTRA_INFO_REQUEST_REJECTED,
          status: 0
        }, { transaction: t })
        // delete question associated to this request
        await db.UserQuestionAnswer.destroy({ where: { extraInfoRequestId: requestId }, transaction: t })
        // sending notification on socket
        notification = JSON.parse(JSON.stringify(notification))
        const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
        notification['User'] = userNameAndCode
        socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, updatedRequest.requesterUserId, notification)
      }
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  answerToQuestion: async (questionId, answer) => {
    const t = await db.sequelize.transaction()
    try {
      await db.UserQuestionAnswer.update({
        answer,
        status: true
      }, { where: { id: questionId }, transaction: t })
      const updatedQuestion = await db.UserQuestionAnswer.findOne({ where: { id: questionId } })
      // send notification
      let notification = await db.Notification.create({
        userId: updatedQuestion.askingUserId,
        resourceId: updatedQuestion.askedUserId,
        resourceType: 'USER',
        notificationType: notificationType.QUESTION_ANSWERED,
        status: 0
      }, { transaction: t })
      await t.commit()
      // push notification
      const isToggleOn = await helperFunctions.checkForPushNotificationToggle(updatedQuestion.askingUserId, updatedQuestion.askedUserId, 'receiveAnswer')
      if (isToggleOn) { // check for toggles on or off
        const { fcmToken } = await db.User.findOne({ where: { id: updatedQuestion.askingUserId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationType.QUESTION_ANSWERED, notificationType.QUESTION_ANSWERED)
      }
      // sending answer on socket
      socketFunctions.transmitDataOnRealtime(socketEvents.ANSWER_RECEIVED, updatedQuestion.askingUserId, updatedQuestion)
      // sending notification on socket
      notification = JSON.parse(JSON.stringify(notification))
      const userNameAndCode = await common.getUserAttributes(notification.resourceId, ['id', 'username', 'code'])
      notification['User'] = userNameAndCode
      socketFunctions.transmitDataOnRealtime(socketEvents.NEW_NOTIFICATION, updatedQuestion.askingUserId, notification)
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  addSeenToUserProfile: async (viewerId, viewedId) => {
    const [viewerUser, viewedUser] = await Promise.all([
      db.Profile.findOne({ where: { userId: viewerId }, attributes: ['sex'] }),
      db.Profile.findOne({ where: { userId: viewedId }, attributes: ['sex'] })
    ]);
    if (viewerUser?.sex === viewedUser?.sex) {
      return false;
    }
    // update record if already exist
    await db.UserSeen.destroy({ where: { viewerId, viewedId } }) // deleting prevoius seen to avoid unnecessary records
    await db.UserSeen.create({ viewerId, viewedId })
    return true
  },
  getUsersWhoSeenMyProfile: async (userId, limit, offset) => {
    return db.UserSeen.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'viewerId', 'viewedId', 'createdAt'],
      where: { viewedId: userId },
      include: {
        model: db.User,
        as: 'viewerUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = viewerUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile,
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
  },
  getUsersIRequestedMoreInfoFrom: async (userId) => {
    return db.ExtraInfoRequest.findAll({
      where: {
        requesterUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED
        },
      },
      include: {
        model: db.User,
        as: 'requesteeUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesteeUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
  },
  getUsersWhoRequestedMoreInfoFromMe: async (userId) => {
    return db.ExtraInfoRequest.findAll({
      where: {
        requesteeUserId: userId,
        status: {
          [Op.ne]: requestStatus.REJECTED
        },
      },
      include: {
        model: db.User,
        as: 'requesterUser',
        attributes: [
          'id',
          'email',
          'username',
          'code',
          [
            Sequelize.literal(`EXISTS(SELECT 1 FROM SavedProfiles WHERE userId = ${userId} AND savedUserId = requesterUser.id)`), 'isSaved'
          ],
        ],
        include: [
          {
            model: db.Profile
          },
          {
            model: db.UserSetting,
            attributes: ['isPremium', 'membership']
          },
          {
            model: db.BlockedUser,
            as: 'blockedUser',
            where: { blockerUserId: userId },
            required: false,
          },
          {
            model: db.BlockedUser,
            as: 'blockerUser',
            where: { blockedUserId: userId },
            required: false,
          },
        ]
      }
    })
  },
  updateUser: async (userId, body) => {
    const { email, phoneNo, password } = body
    // check if password is correct or not
    const user = await db.User.findOne({ where: { id: userId } })
    const isCorrectPassword = await bcryptjs.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new Error('Incorrect password')
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000)
    if (email) { // check if updating email not exist before or used by someone else
      const userExist = await db.User.findOne({ where: { email } })
      if (userExist && userExist.id !== userId) {
        throw new Error('This email is already used by another user.')
      }
      // send verification email to user.
      const verificationCode = Math.floor(100000 + Math.random() * 900000)
      await db.User.update({ tempEmail: email, otp: verificationCode }, { where: { id: userId } })
      const activationLink = process.env.BASE_URL_DEV + "/auth/account-activation/" + userId + "/" + verificationCode
      // send activation link on email of user
      return { activationLink }
    }
    if (phoneNo) {
      // check for phone number already exist or not
      const phoneNumberExist = await db.User.findOne({ where: { phoneNo } })
      if (phoneNumberExist) {
        throw new Error('This phone number is already used by another user')
      }
      // generate otp
      await db.User.update({ otp: verificationCode, otpExpiry: new Date() }, { where: { id: userId } })
      // send otp to user on phoneNo if user verify otp then we need to add/update phoneNo
      const message = user.language === 'en' ? `Mahaba OTP ${verificationCode}` : `محبة ${verificationCode} OTP`
      sendSms(phoneNo, message)
    }
    return { verificationCode }
  },
  getNotificationToggles: async (userId) => {
    return db.NotificationSetting.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { userId },
    })
  },
  updateNotificationToggles: async (userId, body) => {
    return db.NotificationSetting.update(
      { ...body },
      { where: { userId }, }
    )
  },
  getUserWalletAndMembership: async (userId) => {
    return db.User.findOne({
      attributes: [],
      where: { id: userId },
      include: [
        {
          model: db.Wallet,
          attributes: ['userId', 'amount']
        },
        {
          model: db.UserSetting,
          attributes: ['isPremium', 'membership']
        }
      ]
    })
  },
  sendPushNotification: async (userId, body) => {
    const user = await db.User.findOne({
      where: {
        id: userId
      }
    })
    if (!user.fcmToken) {
      throw new Error('Other user does not have FCM token.')
    }
    const { title, description } = body
    const [err, data] = await to(pushNotification.sendNotificationSingle(user.fcmToken, title, description))
    return { err, data }
  },
  createNotification: async (userId, otherUserId, body) => {
    const { type } = body
    const user = await db.User.findOne({ where: { id: userId } })
    // checking if "STRUGGLING_TO_CONNECT"
    if (type === notificationType.STRUGGLING_TO_CONNECT) {
      const notificationExist = await db.Notification.findOne({
        where: {
          userId: otherUserId,
          resourceId: userId,
          notificationType: type,
        },
      })
      if (notificationExist) {
        return false
      }
    }
    await pushNotification.sendNotificationSingle(user.fcmToken, type, type)
    // generating notification for the first time. 
    await db.Notification.create({
      userId: otherUserId,
      resourceId: userId,
      resourceType: 'USER',
      notificationType: type,
      status: false,
    })
    return true
  },
  getFileContentFromS3: async (filename) => {
    let response = await readFileFromS3(process.env.CONFIG_BUCKET, filename);
    response = JSON.parse(response.Body.toString('utf8'))
    return response
  },
  getTransformedFileFromS3: async () => {
    const response = await readFileFromS3(process.env.CONFIG_BUCKET, 'sample.csv');
    const dataInString = response.Body.toString('utf8')
    const jsonData = await csvtojsonV2().fromString(dataInString);
    return jsonData
  }
}

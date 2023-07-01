const { requestStatus, gender, notificationType } = require('../../config/constants')
const helperFunctions = require('../../helpers')
const db = require('../../models')
const { Op } = require('sequelize')
const pushNotification = require('../../utils/push-notification')

module.exports = {
  requestContactDetails: async (requesterUserId, requesteeUserId, body) => {
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
          // requesteeUserId,
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
      if (isFromFemale) {
        /*
          Please confirm you want to send your contact details of this user
          Notes
          Your contact details will not be shown to him unless he accepts your request.
          You will not be able to send your contact details to another user, unless you cancel the present request.
          You will need to wait at least 24 hours to be able to cancel this request.
        */
        await db.ContactDetails.create({
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
      await db.Notification.create(notificationPayload, { transaction: t })
      // push notification
      const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
      await t.commit()
      return request
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  respondToContactDetailsRequest: async (requestId, body) => {
    const t = await db.sequelize.transaction()
    try {
      const contactDetailsRequest = await db.ContactDetailsRequest.findOne({ where: { id: requestId } })
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
          await db.ContactDetails.create({
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
        await db.Notification.create(notificationPayload, { transaction: t })
        // push notification
        const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
        pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
      } else { // rejected 
        requestUpdatePayload['status'] = requestStatus.REJECTED
        notificationPayload['notificationType'] = contactDetailsRequest.isFromFemale ? notificationType.CONTACT_DETAILS_SENT_REJECTED : notificationType.CONTACT_DETAILS_REQUEST_REJECTED
        // generate notification of reject
        await db.Notification.create(notificationPayload, { transaction: t })
      }
      await db.ContactDetailsRequest.update(requestUpdatePayload, { where: { id: requestId }, transaction: t })
      await t.commit()
      return true
    } catch (error) {
      console.log(error)
      await t.rollback()
      throw new Error(error.message)
    }
  },
  blockUser: async (blockerUserId, blockedUserId, reason) => {
    const alreadyBlocked = await db.BlockedUser.findOne({ where: { blockerUserId, blockedUserId } })
    if (alreadyBlocked) {
      throw new Error("you've already blocked this user.")
    }
    return db.BlockedUser.create({ blockerUserId, blockedUserId, reason: JSON.stringify(reason), status: true })
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
        attributes: ['id', 'email', 'username'],
        include: {
          model: db.Profile
        }
      }
    })
  },
  requestPicture: async (requesterUserId, requesteeUserId) => {
    const t = await db.sequelize.transaction()
    try {
      const alreadyRequested = await db.PictureRequest.findOne({ where: { requesterUserId, requesteeUserId, status: requestStatus.PENDING } })
      if (alreadyRequested) {
        throw new Error("you've already requested picture to this user.")
      }
      // create picture request
      const pictureRequest = await db.PictureRequest.create({ requesterUserId, requesteeUserId, status: requestStatus.PENDING }, { transaction: t })
      // create notification and notifiy other user about request
      await db.Notification.create({
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        notificationType: notificationType.PICTURE_REQUEST,
        status: 0
      }, { transaction: t })
      // push notification
      const { fcmToken } = await db.User.findOne({ where: { id: requesteeUserId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationType.PICTURE_REQUEST, notificationType.PICTURE_REQUEST)
      await t.commit()
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
    if (dataToUpdate?.status === requestStatus.ACCEPTED) {
      notificationPayload['notificationType'] = notificationType.PICTURE_SENT
      // push notification
      const { fcmToken } = await db.User.findOne({ where: { id: notificationPayload.userId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationPayload.notificationType, notificationPayload.notificationType)
    } else if (dataToUpdate?.status === requestStatus.REJECTED) {
      notificationPayload['notificationType'] = notificationType.PICTURE_REQUEST_REJECTED
    } else {
      return true
    }
    // create notification and notifiy user about request accept or reject status
    await db.Notification.create(notificationPayload)
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
      attributes: ['id', 'resourceId', 'resourceType', 'notificationType', 'status', 'createdAt']
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
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
        attributes: ['id', 'username', 'code'],
        include: {
          model: db.Profile
        },
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
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
    const { fcmToken } = await db.User.findOne({ where: { id: otherUserId }, attributes: ['fcmToken'] })
    pushNotification.sendNotificationSingle(fcmToken, notificationType.MATCH_CANCELLED, notificationType.MATCH_CANCELLED)
    return true
  },
  markNotificationAsReadOrUnread: async (notificationIds, status) => {
    return db.Notification.update({ status }, {
      where: { id: notificationIds }
    })
  },
  requestExtraInfo: async (requesterUserId, requesteeUserId, body) => {
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
      for (let questionObj of questions) {
        // create user asked question
        const { category, question } = questionObj
        await db.UserQuestionAnswer.create({
          extraInfoRequestId: extraInfoRequest.id,
          askingUserId: requesterUserId,
          askedUserId: requesteeUserId,
          category,
          question,
          requesterUserId,
          requesteeUserId,
          status: false
        }, { transaction: t })
      }
      // create notification
      await db.Notification.create({
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        notificationType: notificationType.QUESTION_RECEIVED,
        status: 0
      }, { transaction: t })
      // push notification
      const { fcmToken } = await db.User.findOne({ where: { id: requesteeUserId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationType.QUESTION_RECEIVED, notificationType.QUESTION_RECEIVED)
      await t.commit()
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
        await db.Notification.create({
          userId: updatedRequest.requesterUserId,
          resourceId: updatedRequest.requesteeUserId,
          resourceType: 'USER',
          notificationType: notificationType.EXTRA_INFO_REQUEST_REJECTED,
          status: 0
        }, { transaction: t })
        // delete question associated to this request
        await db.UserQuestionAnswer.destroy({ where: { extraInfoRequestId: requestId }, transaction: t })
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
      await db.Notification.create({
        userId: updatedQuestion.askingUserId,
        resourceId: updatedQuestion.askedUserId,
        resourceType: 'USER',
        notificationType: notificationType.QUESTION_ANSWERED,
        status: 0
      }, { transaction: t })
      // push notification
      const { fcmToken } = await db.User.findOne({ where: { id: updatedQuestion.askingUserId }, attributes: ['fcmToken'] })
      pushNotification.sendNotificationSingle(fcmToken, notificationType.QUESTION_ANSWERED, notificationType.QUESTION_ANSWERED)
      await t.commit()
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile,
        },
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
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
        attributes: ['id', 'email', 'username', 'code'],
        include: {
          model: db.Profile
        }
      }
    })
  },
}

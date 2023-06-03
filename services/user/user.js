const { requestStatus } = require('../../config/constants')
const helperFunctions = require('../../helpers')
const db = require('../../models')

module.exports = {
  requestContactDetails: async (requesterUserId, requesteeUserId, body) => {
    /*
      You will not be able to request the contact details of another user, unless you cancel the present request
      You will need to wait at least 24 hours to be able to cancel this request
    */
    const alreadyRequested = await db.ContactDetailsRequest.findOne({
      where: {
        requesterUserId,
        // requesteeUserId,
        status: [requestStatus.PENDING, requestStatus.ACCEPTED],
      }
    })
    if (alreadyRequested) {
      throw new Error('Request already exist.')
    }
    const { name, message } = body
    const request = await db.ContactDetailsRequest.create({
      requesterUserId,
      requesteeUserId,
      name,
      message,
      status: requestStatus.PENDING,
    })
    // generate notification
    return request
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
      const { name, personToContact, nameOfContact, phoneNo, message, status } = body
      /*
      Are you sure you want to match with this user?
      Note: All other pending incoming requests will be cancelled
      */
      const requestUpdatePayload = {}
      if (status === requestStatus.ACCEPTED) { // accepted
        requestUpdatePayload['status'] = requestStatus.ACCEPTED
        await db.ContactDetails.create({
          contactDetailsRequestId: requestId,
          name,
          personToContact,
          nameOfContact,
          phoneNo,
          message,
          status: true
        }, { transaction: t })

        // if accept a match is created between these two users
        const { requesterUserId, requesteeUserId } = contactDetailsRequest
        await helperFunctions.createMatchIfNotExist(requesterUserId, requesteeUserId, t)
      } else { // rejected 
        requestUpdatePayload['status'] = requestStatus.REJECTED
      }
      await db.ContactDetailsRequest.update(requestUpdatePayload, { where: { id: requestId }, transaction: t })
      // generate notification
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
      await db.PictureRequest.create({ requesterUserId, requesteeUserId, status: requestStatus.PENDING }, { transaction: t })
      const requesterUser = await db.User.findOne({ where: { id: requesterUserId } })
      // create notification and notifiy other user about request
      await db.Notification.create({
        userId: requesteeUserId,
        resourceId: requesterUserId,
        resourceType: 'USER',
        description: `${requesterUser.username} has requested your picture`,
        status: 0
      }, { transaction: t })
      await t.commit()
      return true
    } catch (error) {
      await t.rollback()
      throw new Error(error.message)
    }
  },
  updatePictureRequest: async (requestId, dataToUpdate) => {
    // update picture request
    await db.PictureRequest.update(dataToUpdate, { where: { id: requestId } })
    const updatedRequest = await db.PictureRequest.findOne({ where: { id: requestId } })
    const requesteeUser = await db.User.findOne({ where: { id: updatedRequest.requesteeUserId } })
    const notificationPayload = {
      userId: updatedRequest.requesterUserId,
      resourceId: updatedRequest.requesteeUserId,
      resourceType: 'USER',
      status: 0
    }
    if (dataToUpdate?.status === requestStatus.ACCEPTED) {
      notificationPayload['description'] = `${requesteeUser.username} has sent you their picture`
    } else if (dataToUpdate?.status === requestStatus.REJECTED) {
      notificationPayload['description'] = `${requesteeUser.username} has declined your picture request`
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
        status: queryStatus === 'unread' ? 0 : [0, 1]
      },
      attributes: ['id', 'resourceId', 'resourceType', 'description', 'status', 'createdAt']
    })
  },
}

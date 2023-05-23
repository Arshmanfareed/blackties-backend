const { requestStatus } = require('../../config/constants')
const db = require('../../models')

module.exports = {
  requestContactDetails: async (requesterUserId, requesteeUserId) => {
    return false
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
}

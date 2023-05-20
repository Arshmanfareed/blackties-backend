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
}

const { Op } = require('sequelize')
const { status } = require('../config/constants')
const db = require('../models')

module.exports = {
  unsuspendUsers: async () => {
    const t = await db.sequelize.transaction()
    try {
      // get those users whose suspend end date is today
      const suspendedUsers = await db.SuspendedUser.findAll({
        where: {
          suspendEndDate: {
            [Op.lte]: new Date()
          }
        }
      })
      if (suspendedUsers.length > 0) {
        const userIds = suspendedUsers.map((user) => user.userId);
        // Update status for all suspended users in bulk
        await db.User.update({ status: status.ACTIVE }, { where: { id: userIds }, transaction: t });
        // Delete all suspended users in bulk
        await db.SuspendedUser.destroy({ where: { userId: userIds }, transaction: t });
      }
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log("Error in unsuspendUsers cron: ", error)
    }
  },
}
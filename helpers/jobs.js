const { Op } = require('sequelize')
const { status, roles } = require('../config/constants')
const db = require('../models')
const common = require('./common')
const moment = require('moment')

module.exports = {
  unsuspendUsers: async () => {
    const t = await db.sequelize.transaction()
    try {
      // get those users whose suspend end date is today
      console.log("check if cron run--------------------------------------")
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
  unlockDescription: async () => {
    try {
      await db.LockedDescription.destroy({
        where: {
          unlockDate: {
            [Op.lte]: new Date()
          }
        }
      })
    } catch (error) {
      console.log("Error in unlockDescription cron: ", error)
    }
  },
  sendProfileStatsToUser: async () => {
    try {
      const users = await db.User.findAll({
        status: status.ACTIVE,
        role: roles.USER,
      })
      const inputDate = moment();
      // Calculate the start and end dates of the previous month
      const startDate = inputDate.clone().subtract(1, 'month').startOf('month');
      const endDate = inputDate.clone().subtract(1, 'month').endOf('month');
      for (let user of users) {
        const stats = await common.fetchUserProfileStats(user.id, startDate, endDate)
        // send email
        console.log('sending email => ', stats)
      }
    } catch (error) {
      console.log("Error in sendProfileStatsToUser cron: ", error)
    }
  },
}
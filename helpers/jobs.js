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
  deleteUser: async () => {
    const t = await db.sequelize.transaction()
    try {
      // get those users whose suspend end date is today
      console.log("check if cron run**************************")
      // Calculate the date one month ago
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Retrieve data where createdAt date is one month or more in the past
      const deactivatedUsers = await db.DeactivatedUser.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneMonthAgo
        }
      }
      });

      // Do something with the retrieved data
      console.log(deactivatedUsers);
      if (deactivatedUsers.length > 0) {
        const userIds = deactivatedUsers.map((user) => user.userId);
        // Update status for all suspended users in bulk
        await db.User.update({ email: 'email_deleted', phoneNo: '' }, { where: { id: userIds }, transaction: t });
        // Delete all suspended users in bulk
        await db.DeactivatedUser.destroy({ where: { userId: userIds }, transaction: t });

        console.log('user delted')
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
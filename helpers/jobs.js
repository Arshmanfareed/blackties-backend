const { Op } = require('sequelize')
const { status, roles } = require('../config/constants')
const db = require('../models')
const common = require('./common')
const moment = require('moment')
const sendMail = require('../utils/sendgrid-mail')


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
        console.log("get deleted those users whose suspend end date is today*************************")
      }
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log("Error in unsuspendUsers cron: ", error)
    }
  },
  cancelsRequests: async () => {
    const t = await db.sequelize.transaction();
    try {
      // Fetch all blocked users
      const blockedUsers = await db.BlockedUser.findAll();
  
      // Calculate the time threshold for 47 hours
      const cutoffDate = new Date(Date.now() - 47 * 60 * 60 * 1000);
      console.log("cutoffDate", cutoffDate);
      // console.log("blockedUsers", blockedUsers);
      // return blockedUsers;
      // Loop through each blocked user
      for (const blockedUser of blockedUsers) {
        const blockedUserId = blockedUser.blockedUserId;
        const blockerUserId = blockedUser.blockerUserId;
  
        // Check ContactDetailsRequest for this blocked user
        const contactRequests = await db.ContactDetailsRequest.findAll({
          where: {
            requesterUserId: blockerUserId,
            requesteeUserId: blockedUserId,
            status: {
              [Op.ne]: 'REJECTED'
            },
            createdAt: {
              [Op.lte]: cutoffDate  // Created more than 47 hours ago
            }
          }
        });

        console.log("contactRequests", contactRequests);
  
        // Cancel each contact request that matches the condition
        for (const request of contactRequests) {
          await request.update({ status: 'REJECTED' }, { transaction: t });
        }
  
        // Check ExtraInfoRequest for this blocked user
        const extraInfoRequests = await db.ExtraInfoRequest.findAll({
          where: {
            requesterUserId: blockerUserId,
            requesteeUserId: blockedUserId,
            status: {
              [Op.ne]: 'REJECTED'
            },
            createdAt: {
              [Op.lte]: cutoffDate  // Created more than 47 hours ago
            }
          }
        });
  
        // Cancel each extra info request that matches the condition
        for (const request of extraInfoRequests) {
          await request.update({ status: 'REJECTED' }, { transaction: t });
        }
  
        // Check PictureRequest for this blocked user
        const pictureRequests = await db.PictureRequest.findAll({
          where: {
            requesterUserId: blockerUserId,
            requesteeUserId: blockedUserId,
            status: {
              [Op.ne]: 'REJECTED'
            },
            createdAt: {
              [Op.lte]: cutoffDate  // Created more than 47 hours ago
            }
          }
        });
  
        // Cancel each picture request that matches the condition
        for (const request of pictureRequests) {
          await request.update({ status: 'REJECTED' }, { transaction: t });
        }

        // Remove matches for blocked users
        await db.Match.destroy({
          where: {
            [Op.or]: [
              { userId: blockedUserId, otherUserId: blockerUserId },
              { userId: blockerUserId, otherUserId: blockedUserId }
            ]
          },
          transaction: t
        });
      }
  
      await t.commit(); // Commit all changes if everything is successful
    } catch (error) {
      await t.rollback(); // Rollback if there's an error
      console.error("Error in cancelsRequests cron: ", error);
    }
  },
  
  deleteUser: async () => {
    const t = await db.sequelize.transaction()
    try {
      // get those users whose suspend end date is today
      
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
      const generateMessage = (stats, monthName) => {
        return `In ${monthName}, ${stats.profileViews} users saw your profile, ${stats.profilesSavedCount} users saved your profile, ${stats.extraInfoRequestCount} users requested more information about you, ${stats.contactDetailsRequestCount} users requested your contact details. To find out who, or to make your profile more attractive, log in to Mahaba.`;
      };
      const inputDate = moment();

      const previousMonth = inputDate.clone().subtract(1, 'month');
      const monthName = previousMonth.format('MMMM');

      // Calculate the start and end dates of the previous month
      const startDate = inputDate.clone().subtract(1, 'month').startOf('month');
      const endDate = inputDate.clone().subtract(1, 'month').endOf('month');
      for (let user of users) {
        const stats = await common.fetchUserProfileStats(user.id, startDate, endDate)
        // send email
        const message = generateMessage(stats, monthName);
        // console.log('sending email => ', message)

        const testUser = await db.User.findOne({
          where: { id: user.id },
          attributes: ['language'],
        });
     

      }
      
    } catch (error) {
      console.log("Error in sendProfileStatsToUser cron: ", error)
    }
  },
  
}
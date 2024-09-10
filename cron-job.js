// we will register all cron jobs here in this file
const cron = require('node-cron')
const jobs = require('./helpers/jobs')

// unsuspend users
cron.schedule(process.env.UNSUSPEND_USER_CRON_EXP, jobs.unsuspendUsers)

cron.schedule(process.env.UNSUSPEND_USER_CRON_EXP, jobs.cancelsRequests)

// delete user from database
cron.schedule(process.env.UNSUSPEND_USER_CRON_EXP, jobs.deleteUser)

// unlock description
cron.schedule(process.env.UNLOCK_DESCRIPTION_CRON_EXP, jobs.unlockDescription)

// send profile stats to user on email
cron.schedule(process.env.STATS_CRON_EXP, jobs.sendProfileStatsToUser)



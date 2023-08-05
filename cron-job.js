// we will register all cron jobs here in this file
const cron = require('node-cron')

const jobs = require('./helpers/jobs')

// unsuspend users
cron.schedule(process.env.UNSUSPEND_USER_CRON_EXP, jobs.unsuspendUsers)

// unlock description
cron.schedule(process.env.UNLOCK_DESCRIPTION_CRON_EXP, jobs.unlockDescription)



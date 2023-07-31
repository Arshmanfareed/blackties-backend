// we will register all cron jobs here in this file
const cron = require('node-cron')

const jobs = require('./helpers/jobs')

// cron job to expire spotlights
cron.schedule(process.env.UNSUSPEND_USER_CRON_EXP, jobs.unsuspendUsers)



const schedule = require('node-schedule');
const ScheduleGetAPI = require('./features/ScheduleGetAPI')

const cronExpress = '*/5 * * * * * *';
// const cronExpress = '*/5 * * * *';

schedule.scheduleJob(cronExpress, ScheduleGetAPI)

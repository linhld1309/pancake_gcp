require('./admin')
const functions = require("firebase-functions");

const api = require('./features/ScheduleGetAPI')
exports.scheduleClone = functions.region('asia-northeast1').pubsub.schedule('every 10 minutes').onRun((context) => {
  return api()
});

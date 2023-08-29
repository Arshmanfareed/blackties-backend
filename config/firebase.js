const FCM = require('fcm-node');
const serverKey = process.env.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);

module.exports = fcm
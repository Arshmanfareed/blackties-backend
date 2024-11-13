const admin = require("firebase-admin");

var serviceAccount = require("../config/mahaba-2-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const messaging = admin.messaging();
// const fcm = require('../config/firebase')
const notify_tra = require('../config/notification-trans');

module.exports = {
  sendNotificationSingle: async (token, key, body, user, notifyUser) => {
    if (!token) {
      console.error('Token is empty');
      return false;
    }

    const title = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].title : key;
    let description = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].message : key;

    description = description.replace('{{username}}', user.username).replace('{{code}}', user.code);

    const message = {
      token: token,
      notification: {
        title: title,
        body: description,
      },
      data: {}, // Add custom data here if needed
    };

    try {
      const response = await messaging.send(message);
      console.log('Message sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return error;
    }
  },
};

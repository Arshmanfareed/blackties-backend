const fcm = require('../config/firebase')

module.exports = {
  sendNotificationSingle: async (token, title, body, payload = JSON.stringify({})) => {
    if(!token) return false
    const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: token,
      collapse_key: title,
      notification: { title, body },
      data: {}, //you can send only notification or only data(or include both)
    };
    return new Promise((resolve, reject) => {
      fcm.send(message, function (err, response) {
        if (err) {
          console.log('Error sending firebase message:', err);
          reject(err)
        } else {
          console.log("Successfully sent with response: ", response);
          resolve(response)
        }
      });
    })
  },
}
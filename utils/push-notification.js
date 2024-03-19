const fcm = require('../config/firebase')
const notify_tra = require('../config/notification-trans')

module.exports = {
  sendNotificationSingle: async (token, key, body, user) => {
    if(!token) return false
  
    let title = notify_tra[key] ? notify_tra[key].title : key;
    let description = notify_tra[key] ? notify_tra[key].message : key;

    description = description.replace('{{username}}', user.username).replace('{{code}}', user.code);

    const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: token,
      collapse_key: title,
      notification: { title, body: description },
      data: {}, //you can send only notification or only data(or include both)
    };
    return new Promise((resolve, reject) => {
      fcm.send(message, function (err, response) {
        if (err) {
          console.log('Error sending firebase message:', err);
          resolve(err)
        } else {
          console.log("Successfully sent with response: ", response);
          resolve(response)
        }
      });
    })
  },
}
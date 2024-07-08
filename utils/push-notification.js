// const fcm = require('../config/firebase')
// const notify_tra = require('../config/notification-trans')

// module.exports = {
//   sendNotificationSingle: async (token, key, body, user, notifyUser) => {
//     if(!token) return false


  
//     let title = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].title : key;
//     let description = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].message : key;

//     description = description.replace('{{username}}', user.username).replace('{{code}}', user.code);

//     const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//       to: token,
//       collapse_key: title,
//       notification: { title, body: description },
//       data: {}, //you can send only notification or only data(or include both)
//     };
//     return new Promise((resolve, reject) => {
//       fcm.send(message, function (err, response) {
//         if (err) {
//           console.log('Error sending firebase message:', err, description);
//           resolve(err)
//         } else {
//           console.log("Successfully sent with response: ", response, description);
//           resolve(response)
//         }
//       });
//     })
//   },
// }

const { sendFcmMessage } = require('../config/firebase');
const notify_tra = require('../config/notification-trans');

module.exports = {
  sendNotificationSingle: async (token, key, body, user, notifyUser) => {
    if (!token) return false;

    const title = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].title : key;
    let description = notify_tra[notifyUser.language][key] ? notify_tra[notifyUser.language][key].message : key;

    description = description.replace('{{username}}', user.username).replace('{{code}}', user.code);

    const message = {
      message: {
        token,
        notification: {
          title,
          body: description,
        },
        data: {}, // Add custom data here if needed
      }
    };

    try {
      const response = await sendFcmMessage(message);
      console.log("Successfully sent with response:", response, description);
      return response;
    } catch (err) {
      console.log('Error sending firebase message:', err, description);
      return err;
    }
  },
};
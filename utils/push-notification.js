const firebase = require('../config/firebase')

module.exports = {
  sendNotificationSingle: async (token, title, body, payload = JSON.stringify({})) => {
    if (!token) return false
    const message = {
      data: { data: payload },
      notification: { title, body },
      token
    }
    const firebaseMessaging = await firebase()
    firebaseMessaging.send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent firebase message:', response);
      })
      .catch((error) => {
        console.log('Error sending firebase message:', error);
      })
  },
  sendNotificationBulk: async (tokensArray, title, body, payload = JSON.stringify({})) => {
    if (!Array.isArray(tokensArray)) throw new Error('Tokens must be in array.')
    if (tokensArray.length === 0) return false
    const message = {
      data: { data: payload },
      notification: { title, body },
      tokens: tokensArray
    }
    const firebaseMessaging = await firebase()
    firebaseMessaging.sendMulticast(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent firebase message:', response);
      })
      .catch((error) => {
        console.log('Error sending firebase message:', error);
      })
  },
}
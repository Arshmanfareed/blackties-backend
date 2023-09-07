const twilio = require('../config/twilio')

module.exports = (toPhoneNumber, message) => {
  try {
    twilio.messages
      .create({
        body: message,
        from: process.env.FROM_PHONE,
        to: toPhoneNumber,
      })
      .then(message => console.log('Message Sent: ', message));
  } catch (error) {
    console.log('Error sending message from twilio: ', error)
  }
}
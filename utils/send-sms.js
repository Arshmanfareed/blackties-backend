// const AWS = require('aws-sdk')
require('dotenv').config({ path: '../.env' })

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, FROM_PHONE_NO } = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.sendSMS = (phoneNumber, code) => {
  console.log(`sending otp ${code} on phone number ${phoneNumber}`);
  try {
    // Download the helper library from https://www.twilio.com/docs/node/install
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure

    client.messages
      .create({
        body: `Your Mahaba verification code is ${code}`,
        from: FROM_PHONE_NO,
        to: phoneNumber
      })
      .then(message => console.log(message.sid));

    // const params = {
    //   Message: `Your Mahaba verification code is ${code}`,
    //   PhoneNumber: phoneNumber,
    // }
    // return new AWS.SNS({
    //   correctClockSkew: true,
    //   apiVersion: '2010-03-31',
    //   accessKeyId: process.env.ACCESS_KEY_ID,
    //   secretAccessKey: process.env.SECRET_ACCESS_KEY,
    //   region: process.env.AWS_SNS_REGION,
    // })
    //   .publish(params)
    //   .promise()
  } catch (error) {
    console.log(error)
  }
}

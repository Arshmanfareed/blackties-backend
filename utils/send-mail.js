const nodemailer = require('nodemailer')
const {
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_AUTH_USER,
  MAIL_AUTH_PASSWORD,
  MAIL_FROM,
} = process.env

module.exports = (recipient, subject, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_AUTH_USER,
        pass: MAIL_AUTH_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    let message = {
      from: MAIL_FROM,
      to: recipient,
      subject,
      text: body,
    }
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Mail error occurred: ' + err.message)
      }
    })
  } catch (error) {
    console.log('Error sending mail: ', error)
  }
}

const { MAIL_FROM, SENDGRID_API_KEY } = process.env
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async (recipient, subject, body) => {
  try {
    const message = {
      to: recipient,
      from: MAIL_FROM, // Use the email address or domain you verified above
      subject,
      text: body,
      html: body,
    };
    await sgMail.send(message)
  } catch (error) {
    console.log('Error sending mail: ', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

const { MAIL_FROM, SENDGRID_API_KEY } = process.env
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async (templateId, recipient, subject, dynamicParams) => {
  try {
    const message = {
      to: recipient,
      from: MAIL_FROM, // Use the email address or domain you verified above
      subject,
      templateId,
      dynamicTemplateData: dynamicParams
    };
    const sendedResponse = await sgMail.send(message)
    console.log("sendedResponse ===> ", sendedResponse)
  } catch (error) {
    console.log('Error sending mail: ', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

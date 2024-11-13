const { MAIL_FROM_NOTIFICATION, SENDGRID_API_KEY } = process.env
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async (templateId, recipient, subject, dynamicParams,  mailForm = MAIL_FROM_NOTIFICATION) => {
  try {
    const message = {
      to: recipient,
      from: mailForm,
      subject,
      templateId,
      dynamicTemplateData: dynamicParams
    };
    const sendedResponse = await sgMail.send(message)
    console.log("sendedResponse ===> ", sendedResponse, message)
  }
  catch (error) {
    console.log("Error in Sendgrid", error)
  }
}

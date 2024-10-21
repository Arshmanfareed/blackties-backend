const nodemailer = require('nodemailer')
const {
  MAIL_SERVICE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_AUTH_USER,
  MAIL_AUTH_PASSWORD,
  MAIL_FROM,
} = process.env

module.exports = (recipient, subject, type, data) => {
  try {
  
    let transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_PORT == 465, // true for port 465, false for other ports
      auth: {
        user: MAIL_AUTH_USER,
        pass: MAIL_AUTH_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Set based on your needs
      },
    });

    let messageTemplate;
    if (type === 'emailVerification') {
      // Template for email verification
      messageTemplate = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="color: #555;">Your verification code is:</p>
          <h3 style="color: #4CAF50;">${data}</h3>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">Please use this code to verify your account.</p>
        </div>
      `;
    } else if (type === 'resetPassword') {
      // Template for password reset
      messageTemplate = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="color: #555;">Click the link below to reset your password:</p>
          <a href="${data}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="color: #888; font-size: 12px; margin-top: 20px;">If you did not request this password reset, please ignore this email.</p>
        </div>
      `;
    }

    let message = {
      from: MAIL_FROM || MAIL_AUTH_USER, // Fallback to the sender email
      to: recipient,
      subject,
      html: messageTemplate,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Mail error occurred: ' + err.message);
      } else {
        console.log('Email sent successfully: ' + info.response);
      }
    });
  } catch (error) {
    console.log('Error sending mail: ', error);
  }
}


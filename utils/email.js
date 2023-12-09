const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    // host: 'smtp.forwardemail.net',
    // port: 465,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: 'Davjire <davjire@outlook.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: ,
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

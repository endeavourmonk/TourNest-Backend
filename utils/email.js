// To send email using own email using nodemailer.
const nodemailer = require('nodemailer');
const path = require('path');
const renderEmailTemplate = require('./renderEmailTemplate');

const password = process.env.EMAIL_PASSWORD;
const email = process.env.EMAIL_USERNAME;

// Extract and capitalize the first name of the Sender
const namePart = email.split('@')[0];
const Sender = namePart.charAt(0).toUpperCase() + namePart.slice(1);

const templatePath = path.join(__dirname, '../views/emailTemplate.html');

// module.exports = class Email {
//   constructor(user, url = '') {
//     this.name = user.name.split(' ')[0];
//     this.to = user.email;
//     this.from = `${Sender} <${email}>`;
//     this.url = url;
//   }

//   createTransport_() {
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       secure: false,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: email,
//         pass: password,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });
//   }

//   async sendMail(template, subject) {
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html: template,
//     };

//     const transporter = this.createTransport_();

//     const server = await new Promise((resolve, reject) => {
//       // verify connection configuration
//       transporter.verify((error, success) => {
//         if (success) resolve(success);
//         reject(error);
//       });
//     });

//     if (!server) throw new Error(`Error, Failed.`);

//     const success = await new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions).then((info, err) => {
//         if (info.response.includes('250')) resolve(true);
//         console.log('send failed--', err);
//         reject(err);
//       });
//     });

//     if (!success) throw new Error(`Error sending email`);
//   }

//   async sendWelcome() {
//     const replacements = {
//       headerTitle: 'Welcome to TourNest!',
//       userName: this.name,
//       mainMessage: 'Thank you for joining us.',
//       ctaLink: 'https://example.com',
//       ctaText: 'Get Started',
//     };
//     const emailTemplate = await renderEmailTemplate(templatePath, replacements);
//     await this.sendMail(emailTemplate, `Welcome to the TourNest!`);
//   }

//   async sendPasswordReset() {
//     const replacements = {
//       headerTitle: 'Password Reset Request',
//       userName: this.name,
//       mainMessage:
//         'We received a request to reset your password. Click the link below to reset it. Link valid for 10 mins.',
//       ctaLink: this.url,
//       ctaText: 'Reset Password',
//     };
//     const emailTemplate = await renderEmailTemplate(templatePath, replacements);
//     await this.sendMail(emailTemplate, `TourNest, Password Reset`);
//   }
// };

module.exports = class Email {
  constructor(user, url = '') {
    this.name = user.name.split(' ')[0];
    this.to = user.email;
    this.from = `${Sender} <${email}>`;
    this.url = url;
  }

  createTransport_() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      secure: false,
      port: process.env.EMAIL_PORT,
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(template, subject) {
    // Define mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };

    const transporter = this.createTransport_();
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  }

  async sendWelcome() {
    const replacements = {
      headerTitle: 'Welcome to TourNest!',
      userName: this.name,
      mainMessage: 'Thank you for joining us.',
      ctaLink: 'https://example.com',
      ctaText: 'Get Started',
    };
    const emailTemplate = await renderEmailTemplate(templatePath, replacements);
    await this.sendMail(emailTemplate, `Welcome to the TourNest!`);
  }

  async sendPasswordReset() {
    const replacements = {
      headerTitle: 'Password Reset Request',
      userName: this.name,
      mainMessage:
        'We received a request to reset your password. Click the link below to reset it. Link valid for 10 mins.',
      ctaLink: this.url,
      ctaText: 'Reset Password',
    };
    const emailTemplate = await renderEmailTemplate(templatePath, replacements);
    await this.sendMail(emailTemplate, `TourNest, Password Reset`);
  }
};

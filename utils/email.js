// To send email using own email using nodemailer.
const Resend = require('resend');
const nodemailer = require('nodemailer');
const path = require('path');
const renderEmailTemplate = require('./renderEmailTemplate');

const password = process.env.EMAIL_PASSWORD;
// Extract and capitalize the first name of the Sender
const email = process.env.EMAIL_USERNAME;
const namePart = email.split('@')[0];
const Sender = namePart.charAt(0).toUpperCase() + namePart.slice(1);

const templatePath = path.join(__dirname, '../views/emailTemplate.html');

module.exports = class Email {
  constructor(user, url = '') {
    this.name = user.name.split(' ')[0];
    this.to = user.email;
    this.from = `${Sender} <${email}>`;
    this.url = url;
  }

  createTransport_() {
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      secureConnection: false,
      port: 587,
      auth: {
        user: email,
        pass: password,
      },

      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });
    return transporter;
  }

  async sendMail(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };

    const transporter = this.createTransport_();
    const server = await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify((error, success) => {
        if (success) {
          resolve(success);
        }
        reject(error);
      });
    });
    if (!server) {
      throw new Error(`Error, Failed.`);
    }

    const success = await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions).then((info, err) => {
        if (info.response.includes('250')) {
          resolve(true);
        }
        reject(err);
      });
    });

    if (!success) {
      throw new Error(`Error sending email`);
    }
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

// module.exports = class Email {
//   constructor(user, url = '') {
//     this.name = user.name.split(' ')[0];
//     this.to = user.email;
//     this.from = `${Sender} <${email}>`;
//     this.url = url;
//   }

//   createTransport_() {
//     return nodemailer.createTransport({
//       service: 'Outlook',
//       auth: {
//         user: email,
//         pass: password,
//       },
//     });
//   }

//   async sendMail(template, subject) {
//     // Define mail options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html: template,
//     };

//     // create a transport and send mail.
//     // await this.createTransport_().sendMail(mailOptions);
//     await new Promise((resolve, reject) => {
//       nodemailer
//         .createTransport({
//           service: 'Outlook',
//           auth: {
//             user: email,
//             pass: password,
//           },
//         })
//         .sendMail(mailOptions, (err, info) => {
//           if (err) {
//             console.error(err);
//             reject(err);
//           } else {
//             resolve(info);
//           }
//         });
//     });
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

// const resend = new Resend.Resend(process.env.RESEND_API_KEY);

// module.exports = class Email {
//   constructor(user, url = '') {
//     this.name = user.name.split(' ')[0];
//     this.to = user.email;
//     this.from = `${Sender} <${email}>`;
//     this.url = url;
//   }

//   async sendMail(template, subject) {
//     // Define mail options
//     const mailOptions = {
//       // from: this.from,
//       from: 'Acme <onboarding@resend.dev>',
//       to: 'decentlearner@gmail.com',
//       subject,
//       html: template,
//     };

//     const { data, error } = await resend.emails.send(mailOptions);
//     console.log('data:');
//     console.dir(data, { depth: null, colors: true });
//     console.log('err:');
//     console.dir(error, { depth: null, colors: true });
//     if (error) throw new Error(`Error sending email`);
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

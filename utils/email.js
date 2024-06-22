// To send email using own email using nodemailer.
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
    return nodemailer.createTransport({
      service: 'Outlook',
      auth: {
        user: email,
        pass: password,
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

    // create a transport and send mail.
    console.log('sent mail');
    await this.createTransport_().sendMail(mailOptions);
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

// const Resend = require('resend');

// const resend = new Resend.Resend(process.env.RESEND_API_KEY);

// module.exports = class Email {
//   constructor(user, url = '') {
//     this.name = user.name.split(' ')[0];
//     this.to = user.email;
//     this.from = `Acme <onboarding@resend.dev>`;
//     this.url = url;
//   }

//   async sendMail(template, subject) {
//     // Define mail options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html: template,
//     };

//     const { data, error } = await resend.emails.send(mailOptions);
//     if (error) throw new Error(`Error sending email`);

//     // console.log('data:');
//     // console.dir(data, { depth: null, colors: true });
//     // console.log('err:');
//     // console.dir(error, { depth: null, colors: true });
//   }

//   async sendWelcome() {
//     await this.sendMail(`Welcome ${this.name}`, `Welcome to the TourNest!`);
//   }
// };

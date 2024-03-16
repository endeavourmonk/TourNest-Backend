const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url = '') {
    this.name = user.name.split(' ')[0];
    this.to = user.email;
    this.from = `Davjire <davjire@outlook.com>`;
    this.url = url;
  }

  createTransport_() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'Outlook',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.RESEND_USER,
          pass: process.env.RESEND_API_KEY,
        },
      });
    }
    return nodemailer.createTransport({
      service: 'Outlook',
      // host: 'smtp.forwardemail.net',
      // port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
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
    await this.createTransport_().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.sendMail(`Welcome ${this.name}`, `Welcome to the TourNest!`);
  }
};

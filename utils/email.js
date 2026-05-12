const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Farah Mahfouz <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Send Grid
      return nodemailer.createTransport({
        // service: 'SendGrid',
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    await this.newTransport()
      .sendMail(mailOptions)
      .catch((err) => {
        console.log('EMAIL ERROR:', err);
      });
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 mins)'
    );
  }

  /** Send a simple notification email (for booking confirmations, reminders, etc.) */
  static async sendNotificationEmail(to, subject, title, message) {
    const transport =
      process.env.NODE_ENV === 'production'
        ? nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          })
        : nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

    const html = pug.renderFile(`${__dirname}/../views/email/notification.pug`, {
      title,
      message,
      subject,
    });

    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'Clinic <noreply@clinic.com>',
      to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    }).catch((err) => {
      console.log('Notification email error:', err?.message);
    });
  }
};
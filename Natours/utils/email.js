const { convert } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Musaif <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.PROD_EMAIL_HOST,
        port: process.env.PROD_EMAIL_PORT,
        auth: {
          user: process.env.PROD_EMAIL_LOGIN,
          pass: process.env.PROD_EMAIL_PASSWORD,
        },
      });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter;
  }
  async send(template, subject) {
    const file = path.join(__dirname, `../views/email/${template}.pug`);
    const html = pug.renderFile(file, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Welcome to the Natours Family');
  }
}

module.exports = Email;

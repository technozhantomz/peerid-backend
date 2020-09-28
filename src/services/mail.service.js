const fs = require('fs-extra');
const Handlebars = require('handlebars');

class MailService {

  /**
   * @param {Object} opts
   * @param {AppConfig} opts.config
   * @param {SmtpConnection} opts.smtpConnection
   */
  constructor(opts) {
    this.config = opts.config;
    this.smtpConnection = opts.smtpConnection;
  }

  async sendMailAfterRegistration(username, email, peerplaysPassword, uniqueLink) {
    const sourceHTML = fs.readFileSync(`${__dirname}/templates/welcome.handlebars`).toString();
    const templateHTML = Handlebars.compile(sourceHTML);
    const url = `${this.config.frontendCallbackUrl}/confirm-email/${uniqueLink}`;
    const contact = 'mailto:support@peerid.com';
    const terms = `${this.config.frontendUrl}/terms`;
    const resultHtml = templateHTML({username, url, contact, terms, peerplaysPassword});

    const options = {
      to: email,
      from: this.config.mailer.sender,
      subject: 'Peer ID Account Registration',
      html: resultHtml
    };
    await this.smtpConnection.sendMail(options);
  }

  async sendMailAfterRegistration(username, email, peerplaysPassword, uniqueLink) {
    const sourceHTML = fs.readFileSync(`${__dirname}/templates/welcome.handlebars`).toString();
    const templateHTML = Handlebars.compile(sourceHTML);
    const url = `${this.config.frontendCallbackUrl}/confirm-email/${uniqueLink}`;
    const resultHtml = templateHTML({username, url, peerplaysPassword});

    const options = {
      to: email,
      from: this.config.mailer.sender,
      subject: 'Peer ID Account Registration',
      html: resultHtml
    };
    await this.smtpConnection.sendMail(options);
  }

  async sendMailMasterPassword(username, email, peerplaysPassword) {
    const sourceHTML = fs.readFileSync(`${__dirname}/templates/peerplays-password.handlebars`).toString();
    const templateHTML = Handlebars.compile(sourceHTML);
    const resultHtml = templateHTML({username, peerplaysPassword});

    const options = {
      to: email,
      from: this.config.mailer.sender,
      subject: 'Peer ID Account Registration',
      html: resultHtml
    };
    await this.smtpConnection.sendMail(options);
  }

  async sendMailResetPassword(username, email, uniqueLink) {
    const sourceHTML = fs.readFileSync(`${__dirname}/templates/reset-password.handlebars`).toString();
    const templateHTML = Handlebars.compile(sourceHTML);
    const url = `${this.config.frontendCallbackUrl}/reset-password/${uniqueLink}`;
    const resultHtml = templateHTML({username, url});

    const options = {
      to: email,
      from: this.config.mailer.sender,
      subject: 'PeerID Reset Password',
      html: resultHtml
    };
    await this.smtpConnection.sendMail(options);
  }

  async sendMailForChangeEmail(username, email, uniqueLink) {
    const sourceHTML = fs.readFileSync(`${__dirname}/templates/change-email.handlebars`).toString();
    const templateHTML = Handlebars.compile(sourceHTML);
    const url = `${this.config.frontendCallbackUrl}/change-email/${uniqueLink}`;
    const resultHtml = templateHTML({username, url});

    const options = {
      to: email,
      from: this.config.mailer.sender,
      subject: 'PeerID Change Email',
      html: resultHtml
    };
    await this.smtpConnection.sendMail(options);
  }

}

module.exports = MailService;

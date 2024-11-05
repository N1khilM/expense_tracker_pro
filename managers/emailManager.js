const nodemailer = require("nodemailer");

const emailManager = async (to, text, html, subject) => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cf827149f091f7",
      pass: "4ea177c40a823f",
    },
  });

  transport.sendMail({
    to: to,
    from: "info@expensetracker.com",
    subject: subject,
    text: text,
    html: html,
  });
};

module.exports = emailManager;

const nodemailer = require("nodemailer");

module.exports = (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "SendinBlue",
    auth: {
      user: "abdulazizkadeem@gmail.com",
      pass: "VXxn1aIGmSB8gj2H",
    },
  });

  const options = {
    from: "abdulazizhassankehinde@gmail.com",
    to,
    subject,
    text: message,
  };

  transporter.sendMail(options, (error, info) => {
    if (error) console.log("errrrrrr", error);
    else console.log("EMAIL SENT SUCCESSFULLY");
  });
};

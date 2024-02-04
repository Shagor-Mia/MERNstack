const nodemailer = require("nodemailer");
const { smtpUsername, smtpPasword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 25,
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPasword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
  } catch (error) {
    console.error("Error occured while sending email:", error);
  }
};
module.exports = { emailWithNodeMailer };

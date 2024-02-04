const createError = require("http-errors");
const { emailWithNodeMailer } = require("./email");

const sendMail = async (emailData) => {
  try {
    emailWithNodeMailer(emailData);
  } catch (EmailError) {
    throw createError(500, "failed to send verification email!");
  }
};

module.exports = { sendMail };

require("dotenv").config();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_ATLAS;

const defaultImgPath = process.env.DEFAULT_IMG || "public/images/users";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "sagor123";
const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;

const jwtResetPassKey = process.env.JWT_RESET_PASSWORD_KEY;

const smtpUsername = process.env.SMTP_USERNAME || "";

const smtpPasword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  PORT,
  MONGO_URL,
  defaultImgPath,
  jwtActivationKey,
  smtpUsername,
  smtpPasword,
  clientURL,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPassKey,
};

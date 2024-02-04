const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json({ format: "YYYY-DD-MM  HH:mm:ss" })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),

    // storing success file
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
    }),
    // storing error file
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
    }),
  ],
});

module.exports = logger; //

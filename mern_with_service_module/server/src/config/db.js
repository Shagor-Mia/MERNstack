const mongoose = require("mongoose");
const { MONGO_URL } = require("../secret");
const logger = require("../controllers/loggerControllers");

const connnectDB = async (options = {}) => {
  try {
    await mongoose.connect(MONGO_URL, options);
    console.log("mongoDB successfully connected.");
    // logger.log("info", "mongoDB successfully connected.");

    mongoose.connection.on("error", (error) => {
      console.error("DB connection errors:", error);
      // logger.log("error", "DB connection errors:", error);
    });
  } catch (error) {
    console.error("could not connected to DB:", error);
    // logger.log("error", "could not connected to DB:", error.toString());
    process.exit(1);
  }
};
module.exports = connnectDB;

const app = require("./app");

const connnectDB = require("./config/db");
const logger = require("./controllers/loggerControllers");
const { PORT } = require("./secret");

app.listen(PORT, async () => {
  console.log(`server running at http://localhost:${PORT}`);
  // logger.log("info", `server running at http://localhost:${PORT}`);
  await connnectDB();
});

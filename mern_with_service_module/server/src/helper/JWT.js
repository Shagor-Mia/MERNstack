const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("payload must be non-empty!");
  }

  if (typeof secretKey !== "string" || secretKey === "") {
    throw new Error("secret ke must be string & none empty!");
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("fail to sign in jwt:", error);
    throw error;
  }
};

module.exports = { createJSONWebToken };

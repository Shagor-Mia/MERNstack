const express = require("express");

const { runValidation } = require("../validators");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
} = require("../controllers/auth.controller");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtected);

module.exports = { authRouter };

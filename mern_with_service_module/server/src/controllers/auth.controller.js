const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { createJSONWebToken } = require("../helper/JWT");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { setAccessToken, setRefreshToken } = require("../helper/cookie");

const handleLogin = async (req, res, next) => {
  try {
    // 1.extracting email and password from req.body.
    const { email, password } = req.body;
    // 2.isExist.
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createError(
        404,
        "user does not exist with this email.please register first."
      );
    }
    // 3.compare the password.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "email or password did not match.");
    }
    // 4.isBanned.
    if (user.isBanned) {
      throw createError(
        403,
        "your id is banned.please contact to the authority!"
      );
    }
    // 5.generate token,set token into cookies.
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "5m");
    await setAccessToken(res, accessToken);

    // 6.refresh token,set token into cookies.
    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");
    await setRefreshToken(res, refreshToken);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return successResponse(res, {
      statusCode: 200,
      message: "user loggedIn successfully!",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return successResponse(res, {
      statusCode: 200,
      message: "user logged out successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      throw createError(401, "refresh token is required!");
    } //
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey); //
    if (!decodedToken) {
      throw createError(401, "refresh token is invalid!"); //
    }

    const accessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccessKey,
      "5m"
    );
    await setAccessToken(res, accessToken);

    return successResponse(res, {
      statusCode: 200,
      message: "new access token is generated!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleProtected = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken) {
      throw createError(401, "invalid access token!. please login again.");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "protected resource access successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleRefreshToken,
  handleProtected,
  handleLogout,
};

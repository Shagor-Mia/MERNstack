const createError = require("http-errors");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { successResponse } = require("./response.controller");
const { createJSONWebToken } = require("../helper/JWT");
const { jwtActivationKey, clientURL } = require("../secret");
const {
  findUsers,
  findUserByid,
  handleUserAction,
  deleteuserByid,
  updateUserByid,
  updateUserPassword,
  forgetPasswordByEmail,
  ResetPassword,
} = require("../services/userService");
const { checkUserExists } = require("../helper/checkUserExists");
const { sendMail } = require("../helper/sendEmail");

const handleGetUser =
  ("/api/user",
  async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { user, pagination } = await findUsers(search, limit, page);

      return successResponse(res, {
        statusCode: 200,
        message: "user details.",
        payload: {
          users: user,
          pagination: pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  });

const handleGetOneUserById =
  ("/api/user",
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const options = { password: 0 };
      const user = await findUserByid(id, options);

      return successResponse(res, {
        statusCode: 200,
        message: "single user details.",
        payload: { user },
      });
    } catch (error) {
      next(error);
    }
  });

const handleDeleteUserById =
  ("/api/user",
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const options = { password: 0 };

      await deleteuserByid(id, options);

      return successResponse(res, {
        statusCode: 200,
        message: "user was deleted successfully.",
        payload: {},
      });
    } catch (error) {
      next(error);
    }
  });

const handleProcessRegister =
  ("/api/user",
  async (req, res, next) => {
    try {
      const { name, email, password, phone, address } = req.body;

      const img = req.file;
      if (img) {
        if (img.size > 1024 * 1024 * 2) {
          throw createError(
            400,
            "image file is is too large.it should not greater than 2 MB!"
          );
        }
      }

      const userExists = await checkUserExists(email);
      if (userExists) {
        throw createError(409, "user already exist! please login. ");
      }

      bcrypt.hash(password, 8, function async(err, hash) {
        const tokenPayLoad = { name, email, password: hash, phone, address };
        if (img) {
          console.log(img);
          tokenPayLoad.image = img.path;
        }

        const token = createJSONWebToken(tokenPayLoad, jwtActivationKey, "10m");

        // prepare email
        const emailData = {
          email,
          subject: "account activation email",
          html: `
           <h2>hello ${name}!</h2>
           <p>please click here to <a href = "${clientURL}/api/users/activate/${token} ">activate your account</a></p>
            `,
        };

        // send email with nodemailer
        sendMail(emailData);

        return successResponse(res, {
          statusCode: 200,
          message: `please go to your ${email} to complete registration.`,
          payload: { token },
        });
      });
    } catch (error) {
      next(error);
    }
  });

const handleActivateUserAccount =
  ("/api/user",
  async (req, res, next) => {
    try {
      const token = req.body.token;
      if (!token) throw createError(404, "token not found!");

      try {
        const decoded = jwt.verify(token, jwtActivationKey);
        if (!decoded) throw createError(401, "user unable to verified!");

        const userExists = await User.exists({ email: decoded.email });
        if (userExists) {
          throw createError(409, "user already exist! please login. ");
        }
        await User.create(decoded);

        return successResponse(res, {
          statusCode: 201,
          message: `user was registered successfully.`,
        });
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          throw createError(401, "token has expired!");
        } else if (error.name === "JsonWebTokenError") {
          throw createError(401, "invalid token!");
        } else {
          throw error;
        }
      }
    } catch (error) {
      next(error);
    }
  });

const handleUpdateUserById =
  ("/api/user",
  async (req, res, next) => {
    try {
      const userId = req.params.id;

      const updatedUser = await updateUserByid(User, userId, req);

      return successResponse(res, {
        statusCode: 200,
        message: "user was updated successfully.",
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  });

const handleBanorUnBanUserById =
  ("/api/user",
  async (req, res, next) => {
    try {
      const userId = req.params.id;
      const action = req.body.action;
      const { successMessage, updatedUser } = await handleUserAction(
        action,
        userId
      );

      return successResponse(res, {
        statusCode: 200,
        message: successMessage,
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  });

// const handleBanUserById =
// ("/api/user",
// async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     await findWithId(User, userId);
//     const updates  ={isBanned:true}
//     const UpdateOptions = {
//       new: true,
//       runValidators: true,
//       context: "query",
//     };
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updates,
//       UpdateOptions
//     ).select('-password');

//     if (!updatedUser) {
//       throw createError(404, "user was not Banned succesfully!");
//     }

//     return successResponse(res, {
//       statusCode: 200,
//       message: "user was Banned successfully.",
//       // payload: updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// const handleUnBanUserById =
// ("/api/user",
// async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     await findWithId(User, userId);
//     const updates  ={isBanned:false}
//     const UpdateOptions = {
//       new: true,
//       runValidators: true,
//       context: "query",
//     };
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updates,
//       UpdateOptions
//     ).select('-password');

//     if (!updatedUser) {
//       throw createError(404, "user was not UnBanned succesfully!");
//     }

//     return successResponse(res, {
//       statusCode: 200,
//       message: "user was UnBanned successfully.",
//       // payload: updatedUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

const handleForgetPassword =
  ("/api/user",
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const token = await forgetPasswordByEmail(email);

      return successResponse(res, {
        statusCode: 200,
        message: `please go to your ${email} for resetting your password.`,
        payload: token,
      });
    } catch (error) {
      next(error);
    }
  });

const handleResetPassword =
  ("/api/user",
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const updatedUser = await ResetPassword(token, newPassword);

      return successResponse(res, {
        statusCode: 200,
        message: "password reset successfully.",
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  });

const handleUpdatePassword =
  ("/api/user",
  async (req, res, next) => {
    try {
      const { email, oldPassword, newPassword, confirmedPassword } = req.body;
      const userId = req.params.id;
      const updatedUser = await updateUserPassword(
        User,
        userId,
        email,
        oldPassword,
        newPassword,
        confirmedPassword
      );

      return successResponse(res, {
        statusCode: 200,
        message: "user password updated successfully.",
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = {
  handleGetUser,
  handleGetOneUserById,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleBanorUnBanUserById,
  // handleBanUserById,
  // handleUnBanUserById,
  handleForgetPassword,
  handleResetPassword,
  handleUpdatePassword,
};

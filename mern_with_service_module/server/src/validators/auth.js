const { body } = require("express-validator");
const { min } = require("mathjs");

// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required!Please enter your name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("name should be 3 to 31 characters!"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!Please enter valid email.")
    .isEmail()
    .withMessage("invalid Email!"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required!Please enter strong password.")
    .isLength({ min: 6 })
    .withMessage("password at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "password should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required!Please enter your address.")
    .isLength({ min: 3 })
    .withMessage("address should be at least 3 characters!"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required!Please enter your phone number."),

  body("image").optional().isString().withMessage("image is optional"),
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!Please enter valid email.")
    .isEmail()
    .withMessage("invalid Email!"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required!Please enter strong password.")
    .isLength({ min: 6 })
    .withMessage("password at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "password should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),
];

const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!Please enter valid email.")
    .isEmail()
    .withMessage("invalid Email!"),
];

const validateResetPassword = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("token is required!Please enter valid token."),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("newPassword is required!")
    .isLength({ min: 6 })
    .withMessage("newPassword at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "newPassword should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),
];

const validateUserPasswordUpdate = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required!Please enter valid email.")
    .isEmail()
    .withMessage("invalid Email!"),

  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("oldPassword is required!")
    .isLength({ min: 6 })
    .withMessage("oldPassword at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "oldPassword should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("newPassword is required!")
    .isLength({ min: 6 })
    .withMessage("newPassword at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "newPassword should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),

  body("confirmedPassword")
    .trim()
    .notEmpty()
    .withMessage("confirmedPassword is required!")
    .isLength({ min: 6 })
    .withMessage("newPassword at least 6 characters!")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage(
      "confirmedPassword should contain at least one uppercase letter,one lowercase letter,one number and one special characters!"
    ),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserForgetPassword,
  validateResetPassword,
  validateUserPasswordUpdate,
};

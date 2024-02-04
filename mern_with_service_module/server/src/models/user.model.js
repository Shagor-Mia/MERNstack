const { Schema, model } = require("mongoose");
const { defaultImgPath } = require("../secret");

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "username is required!"],
      trim: true,
      maxlength: [31, "maxLength is 31 character!"],
      minlength: [3, "minLength is 3 character!"],
    },
    email: {
      type: String,
      required: [true, "userEmail is required!"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      minlength: [6, "password at least 6 character!"],
    },
    phone: {
      type: String,
      default: false,
    },
    image: {
      type: String,
      default: defaultImgPath,
    },
    address: {
      type: String,
      required: [true, "user address is required!"],
      minlength: [3, "address at least 3 character!"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = { User };

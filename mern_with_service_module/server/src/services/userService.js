const Math = require("mathjs");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const createError = require("http-errors");
const { User } = require("../models/user.model");
const { deleteImage } = require("../helper/deleteimage");
const { findWithId } = require("./findItem");
const { jwtResetPassKey, clientURL } = require("../secret");
const { createJSONWebToken } = require("../helper/JWT");
const { sendMail } = require("../helper/sendEmail");

const findUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const user = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!user || user.length === 0) throw createError(404, "user not found!");

    return {
      user,
      pagination: {
        total_pages: Math.ceil(count / limit),
        current_page: page,
        previous_page: page - 1 > 0 ? page - 1 : null,
        next_page: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

findUserByid = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) {
      createError(404, "user is not found!");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

deleteuserByid = async (id, options) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    if (user && user.image) {
      await deleteImage(user.image);
    }
    if (!user) {
      createError(404, "user is not found!");
    }
    return user; //
  } catch (error) {
    throw error;
  }
};

updateUserByid = async (User, userId, req) => {
  try {
    // const options = { password: 0 };
    const user = await findWithId(User, userId);
    if (!user) {
      throw createError(404, "user is not found!");
    } //
    const UpdateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };
    let updates = {};
    const allowed_fields = ["name", "phone", "address"];
    for (const key in req.body) {
      if (allowed_fields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "email can't be updated!");
      }
    }

    const password = req.body.password;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "image file is is too large.it should not greater than 2 MB!"
        );
      }
      updates.image = image;
      user.image !== "default jpeg" && deleteImage(user.image);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      UpdateOptions
    ).select("-password");
    if (!updatedUser) {
      throw createError(404, "user does not exist with this Id!");
    }
    return updatedUser;
  } catch (error) {
    // moongoose casting error
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "invalid id! moongoose casting errors.");
    }
    throw error;
  }
};

forgetPasswordByEmail = async (email) => {
  try {
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(
        400,
        "user email incorrect. or you are not verified user.please register first!"
      );
    }
    const token = createJSONWebToken({ email }, jwtResetPassKey, "10m");

    // prepare email
    const emailData = {
      email,
      subject: "reset password email",
      html: `
         <h2>hello ${userData.name}!</h2>
         <p>please click here to <a href = "${clientURL}/api/users/reset-password/${token} ">reset your password</a></p>
          `,
    };

    // send email with nodemailer
    sendMail(emailData);

    return token;
  } catch (error) {
    throw error;
  }
};

ResetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, jwtResetPassKey);
    if (!decoded) {
      throw createError(401, "invalid token!");
    }
    const filter = { email: decoded.email };
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const update = { password: hashedPassword };
    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      throw createError(404, "password reset failed!");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

updateUserPassword = async (
  User,
  userId,
  email,
  oldPassword,
  newPassword,
  confirmedPassword
) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createError(400, "user email not found.");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "oldPassword is incorrect!");
    }

    if (newPassword !== confirmedPassword) {
      throw createError(
        400,
        " newPassword and confirmedPassword did not match!"
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "updated password was not found!");
    }
    return updatedUser;
  } catch (error) {
    // moongoose casting error
    if (error instanceof mongoose.Error.CastError) {
      throw createError(400, "invalid id! moongoose casting errors.");
    }
    throw error;
  }
};

const handleUserAction = async (action, userId) => {
  try {
    let update;
    let successMessage;
    if (action === "ban") {
      update = { isBanned: true };
      successMessage = "user was banned successfully!";
    } else if (action === "unban") {
      update = { isBanned: false };
      successMessage = "user was unbanned successfully!";
    } else {
      throw createError(400, 'invalid action! use "ban" or "unban"');
    }

    const UpdateOptions = {
      new: true,
      runValidators: true,
      context: "query",
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      UpdateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "user was not Banned succesfully!");
    }

    return { successMessage, updatedUser };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUsers,
  findUserByid,
  deleteuserByid,
  updateUserByid,
  forgetPasswordByEmail,
  updateUserPassword,
  ResetPassword,
  handleUserAction,
};

const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "catagory name is required!"],
      trim: true,
      unique: true,
      maxlength: [31, "maxLength is 31 character for catagory name!"],
      minlength: [3, "minLength is 3 character for catagory name!"],
    },

    slug: {
      type: String,
      required: [true, "catagory slug is required!"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const categories = model("categories", categorySchema);

module.exports = { categories };

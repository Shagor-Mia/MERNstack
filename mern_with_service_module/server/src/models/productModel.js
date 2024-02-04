const validator = require("validatorjs");
const { Schema, model, default: mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required!"],
      trim: true,
      maxlength: [31, "maxLength is 31 character for product name!"],
      minlength: [3, "minLength is 3 character for product name!"],
    },

    slug: {
      type: String,
      required: [true, "product slug is required!"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "product description is required!"],
      trim: true,
      minlength: [3, "minLength is 3 character for description!"],
    },

    price: {
      type: Number,
      required: [true, "price is required!"],
      trim: true,
      validate: {
        validator: (v) => {
          return v > 0;
        },
        message: (props) => {
          `${props.value} is not a valid price! price should greater then 0.`;
        },
      },
    },

    quantity: {
      type: Number,
      required: [true, "product quantity is required!"],
      trim: true,
      validate: {
        validator: (v) => {
          return v > 0;
        },
        message: (props) => {
          `${props.value} is not a valid price! quantity should greater then 0.`;
        },
      },
    },

    sold: {
      type: Number,
      required: [true, "sold quantity is required!"],
      trim: true,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0, //shipping free or paid some amount.
    },

    image: {
      type: String,
      required: [true, "product image is required."],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "product category is required."],
    }, //
  },

  { timestamps: true }
);

const Products = model("products", productSchema);

module.exports = { Products };

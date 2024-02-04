const { body } = require("express-validator");
const { min } = require("mathjs");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("product name is required!Please enter product name.")
    .isLength({ min: 3 })
    .withMessage("product name at least 3 characters long!"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("description is required!Please enter description.")
    .isLength({ min: 3 })
    .withMessage("description at least 3 characters long!"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("price is required!Please enter price.")
    .isFloat({ min: 0 })
    .withMessage("price must be a positive number."),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("quantity is required!Please enter quantity.")
    .isInt({ min: 1 })
    .withMessage("quantity must be an positive integer."),

  body("category").trim().notEmpty().withMessage("category is required."),

  body("image").optional().isString().withMessage("image is optional"),
];

module.exports = { validateProduct };

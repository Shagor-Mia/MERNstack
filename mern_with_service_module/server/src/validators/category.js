const { body } = require("express-validator");
const { min } = require("mathjs");

const validateCatagory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(" catagory name is required!Please enter catagory name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("catagory name at least 3 characters long!"),

  body("slug").trim(),
];

module.exports = { validateCatagory };

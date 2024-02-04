const { data } = require("../data");
const { Products } = require("../models/productModel");
const { User } = require("../models/user.model");

const seedUser = async (req, res, next) => {
  try {
    //deleting all existing users.
    await User.deleteMany({});
    //inserting new users.
    const users = await User.insertMany(data.users);
    //successful response
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const seedProducts = async (req, res, next) => {
  try {
    //deleting all existing prodouct.
    await Products.deleteMany({});
    //inserting new product.
    const products = await Products.insertMany(data.products);
    //successful response
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser, seedProducts };

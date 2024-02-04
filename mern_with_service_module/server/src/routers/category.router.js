const express = require("express");

const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const {
  handleCreateCategory,
  handleGetCategories,
  handleCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} = require("../controllers/category.controller");
const { validateCatagory } = require("../validators/category");
const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validateCatagory,
  isLoggedIn,
  isAdmin,
  runValidation,
  handleCreateCategory
);

categoryRouter.get("/get/", handleGetCategories);
categoryRouter.get("/get-single/:slug", handleCategory);
categoryRouter.put(
  "/update/:slug",
  validateCatagory,
  isLoggedIn,
  isAdmin,
  runValidation,
  handleUpdateCategory
);
categoryRouter.delete(
  "/delete/:slug",
  validateCatagory,
  isLoggedIn,
  isAdmin,
  runValidation,
  handleDeleteCategory
);

module.exports = categoryRouter;

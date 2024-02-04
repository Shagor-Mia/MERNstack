const createError = require("http-errors");
const { categories } = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../services/categoryService");
const { successResponse } = require("./response.controller");
const slugify = require("slugify");

const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await createCategory(name);

    return successResponse(res, {
      statusCode: 200,
      message: "category created successfully.",
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories(); //
    return successResponse(res, {
      statusCode: 200,
      message: "your catagories is...",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

const handleCategory = async (req, res, next) => {
  try {
    const { slug } = req.params; //
    const category = await getCategory(slug); //

    return successResponse(res, {
      statusCode: 200,
      message: "your single catagory is...",
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    const UpdatedCategory = await UpdateCategory(name, slug); //
    if (!UpdatedCategory) {
      throw createError(400, "updated category was not found.");
    }

    return successResponse(res, {
      statusCode: 201,
      message: "your category updated successfully.",
      payload: UpdatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const deletedCategory = await DeleteCategory(slug);
    if (!deletedCategory) {
      throw createError(400, "category was not found to be deleted.");
    }

    return successResponse(res, {
      statusCode: 201,
      message: "your category deleted successfully.",
      payload: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCategory,
  handleGetCategories,
  handleCategory,
  handleUpdateCategory,
  handleDeleteCategory,
};

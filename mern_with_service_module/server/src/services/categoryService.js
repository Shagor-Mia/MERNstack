const slugify = require("slugify");
const createError = require("http-errors");
const { categories } = require("../models/categoryModel");

const createCategory = async (name) => {
  const newCategory = await categories.create({
    name: name,
    slug: slugify(name), //
  });
  return newCategory;
};

const getCategories = async () => {
  return await categories.find({}).select("name slug").lean();
};

const getCategory = async (slug) => {
  try {
    const category = await categories
      .findOne({ slug: slug })
      .select("name slug")
      .lean();
    if (!category) {
      throw createError(404, "category was not found.");
    }
    return category; //
  } catch (error) {
    throw error;
  }
};

const UpdateCategory = async (name, slug) => {
  const filter = { slug };
  const update = { $set: { name, slug: slugify(name) } };
  const option = { new: true };

  return await categories.findOneAndUpdate(filter, update, option);
};

const DeleteCategory = async (slug) => {
  return await categories.findOneAndDelete({ slug });
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  UpdateCategory,
  DeleteCategory,
}; //

const { Products } = require("../models/productModel");
const slugify = require("slugify");
const createError = require("http-errors");
const { deleteImage } = require("../helper/deleteimage");

const createProduct = async (
  name,
  description,
  price,
  quantity,
  shipping,
  category,
  image
) => {
  try {
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "image file is is too large.it should not greater than 2 MB!"
        );
      }
    }

    const checkProductExists = await Products.exists({ name: name });
    if (checkProductExists) {
      throw createError(409, "product already exist with this name.");
    }

    const createProduct = await Products.create({
      name: name,
      slug: slugify(name),
      description: description,
      price: price,
      quantity: quantity,
      shipping: shipping,
      image: image,
      category: category,
    }); //

    return createProduct;
  } catch (error) {
    throw error;
  }
};

const getProducts = async (page, limit, filter) => {
  try {
    const products = await Products.find(filter)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!products) {
      throw createError(400, "products not found!");
    }

    const count = await Products.find(filter).countDocuments();
    return { products, count };
  } catch (error) {
    throw error;
  }
};

const getSingleProduct = async (slug) => {
  try {
    const Product = await Products.findOne({ slug: slug }).populate("category"); //
    if (!Product) {
      throw createError(400, "product not found!");
    } //
    return Product; //
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (slug) => {
  try {
    const deleteProduct = await Products.findOneAndDelete({ slug: slug });
    if (!deleteProduct) {
      throw createError(400, "product not found!");
    } //
    if (deleteProduct.image) {
      await deleteImage(deleteProduct.image);
    }
    return deleteProduct;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (req, slug, updates, image, UpdateOptions) => {
  try {
    const product = await Products.findOne({ slug: slug });
    if (!product) {
      throw createError(404, "product does not exist with this slug!"); //
    }
    const allowedField = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
    ];
    for (const key in req.body) {
      if (allowedField.includes(key)) {
        updates[key] = req.body[key];
      }
    }
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "image file is is too large.it should not greater than 2 MB!"
        );
      }
      updates.image = image;
      product.image !== "default jpeg" && deleteImage(product.image);
    }
    const UpdateProduct = await Products.findOneAndUpdate(
      { slug },
      updates,
      UpdateOptions
    );
    if (!UpdateProduct) {
      throw createError(404, "product does not exist with this slug!");
    }
    return UpdateProduct; //
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
}; //

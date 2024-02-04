const express = require("express");

const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { uploadProductImg } = require("../middlewares/uploadFile");
const {
  handleCreateProduct,
  handleGetProducts,
  handleGetSingleProduct,
  handleDeleteProduct,
  handleUpdateProductBySlug,
} = require("../controllers/product.controller");
const { validateProduct } = require("../validators/product");
const { runValidation } = require("../validators");

const productRouter = express.Router();

productRouter.post(
  "/create",
  isLoggedIn,
  isAdmin,
  uploadProductImg.single("image"),
  validateProduct,
  runValidation,
  handleCreateProduct
);

productRouter.get("/get", handleGetProducts);
productRouter.get("/get-one/:slug", handleGetSingleProduct);
productRouter.delete("/delete/:slug", isLoggedIn, isAdmin, handleDeleteProduct);
productRouter.put(
  "/update/:slug",
  uploadProductImg.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProductBySlug
);

module.exports = productRouter;

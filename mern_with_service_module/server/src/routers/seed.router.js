const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seed.controller");
const {
  uploadUserImage,
  uploadProductImg,
} = require("../middlewares/uploadFile");
const seedRouter = express.Router();

seedRouter.get("/users", uploadUserImage.single("image"), seedUser);
seedRouter.get("/products", uploadProductImg.single("image"), seedProducts);

module.exports = { seedRouter };

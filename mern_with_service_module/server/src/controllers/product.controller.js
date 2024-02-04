const { successResponse } = require("./response.controller");
const {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../services/productService");

const handleCreateProduct =
  ("/api/user",
  async (req, res, next) => {
    try {
      const { name, description, price, quantity, shipping, category } =
        req.body;

      const image = req.file?.path;

      const newProduct = await createProduct(
        name,
        description,
        price,
        quantity,
        shipping,
        category,
        image
      );

      return successResponse(res, {
        statusCode: 200,
        message: `product was created successfully.`,
        payload: newProduct,
      });
    } catch (error) {
      next(error);
    }
  });

const handleGetProducts =
  ("/api/user",
  async (req, res, next) => {
    try {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 4; //

      const searchRegExp = new RegExp(".*" + search + ".*", "i");
      const filter = {
        $or: [{ name: { $regex: searchRegExp } }],
      };

      const produuctData = await getProducts(page, limit, filter);
      return successResponse(res, {
        statusCode: 200,
        message: `all products are available here.`,
        payload: {
          products: produuctData.products,
          pagination: {
            total_pages: Math.ceil(produuctData.count / limit),
            current_page: page,
            previous_page: page - 1,
            next_page: page + 1,
            totalNumbersOfProducts: produuctData.count,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

const handleGetSingleProduct =
  ("/api/user",
  async (req, res, next) => {
    try {
      const slug = req.params.slug; //
      const singleProduct = await getSingleProduct(slug);
      return successResponse(res, {
        statusCode: 200,
        message: `your single product is here.`,
        payload: singleProduct,
      });
    } catch (error) {
      next(error);
    }
  });

const handleDeleteProduct =
  ("/api/user",
  async (req, res, next) => {
    try {
      const slug = req.params.slug; //
      const deletedProduct = await deleteProduct(slug); //
      return successResponse(res, {
        statusCode: 200,
        message: `single product deleted successfully.`,
        payload: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  });

const handleUpdateProductBySlug =
  ("/api/user",
  async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const UpdateOptions = {
        new: true,
        runValidators: true,
        context: "query",
      };
      let updates = {};
      const image = req.file?.path;
      const updatedProduct = await updateProduct(
        req,
        slug,
        updates,
        image,
        UpdateOptions
      );

      return successResponse(res, {
        statusCode: 200,
        message: "Product was updated successfully.",
        payload: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  });
module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetSingleProduct,
  handleDeleteProduct, //
  handleUpdateProductBySlug,
};

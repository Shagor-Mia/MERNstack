const createError = require("http-errors");
const express = require("express");
const cookie_parser = require("cookie-parser");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const BodyParser = require("body-parser");
const router = require("./routers/user.router");
const { seedRouter } = require("./routers/seed.router");
const { errorResponse } = require("./controllers/response.controller");
const { authRouter } = require("./routers/auth.router");
const categoryRouter = require("./routers/category.router");
const productRouter = require("./routers/product.router");

app.use(cookie_parser());
app.use(cors());
app.use(morgan("dev"));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.use("/api/user", router);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get("/test", (req, res) => {
  res.status(200).send({ message: "api testing working fine." });
});

// client errors handling
app.use((req, res, next) => {
  next(createError(404, "route not found."));
});
// server errors handling
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;

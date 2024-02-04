const express = require("express");
const {
  handleGetUser,
  handleGetOneUserById,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleBanorUnBanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
  // handleBanUserById,
  // handleUnBanUserById,
} = require("../controllers/user.controller");
const { uploadUserImage } = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateResetPassword,
} = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/pro-register",
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  handleProcessRegister
);
router.post("/activate", isLoggedOut, handleActivateUserAccount);
router.get("/", isLoggedIn, isAdmin, handleGetUser);
router.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetOneUserById);
router.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handleDeleteUserById);
router.put(
  "/reset-password/",
  validateResetPassword,
  runValidation,
  handleResetPassword
);
router.put(
  "/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  uploadUserImage.single("image"),
  handleUpdateUserById
);
router.put(
  "/ban-unban-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleBanorUnBanUserById
);
// router.put("/ban-user/:id",isLoggedIn,isAdmin, handleBanUserById);
// router.put("/unban-user/:id",isLoggedIn,isAdmin, handleUnBanUserById);
router.post(
  "/forget-password/",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);
router.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);

module.exports = router;

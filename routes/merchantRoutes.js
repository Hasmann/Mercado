const path = require("path");
const { body, check } = require("express-validator");
const express = require("express");

const adminController = require("./../controller/merchantController");
const authController = require("./../controller/auth");

const router = express.Router();

// /admin/add-product => GET
router.get(
  "/add-product",
  authController.isLoggedIn,
  adminController.getAddProduct
);

// // /admin/products => GET
router.get(
  "/Merchant/allProducts",
  authController.protect,
  authController.authorizedRole("merchant"),
  authController.isLoggedIn,
  adminController.getMerchantProducts
);

// /admin/add-product => POST
router.post(
  "/postProduct",
  // [
  //   check([
  //     "name",
  //     "category",
  //     "price",
  //     "summary",
  //     "description",
  //     "stockQuantity",
  //   ]).custom((value, { req }) => {
  //     if (value.length <= 0) {
  //       throw new Error("ALL FIELDS ARE REQUIRED");
  //     }
  //     return true;
  //   }),
  //   body("name").isString().isLength({ min: 3 }).trim(),
  //   body("price").isFloat(),
  //   body("summary").isLength({ min: 5, max: 400 }).trim(),
  //   body("description").isLength({ min: 5, max: 400 }).trim(),
  //   body("stockQuantity").isLength({ min: 5, max: 400 }).trim(),
  // ],
  authController.protect,
  authController.authorizedRole("merchant"),
  adminController.postProductss
);

router.post(
  "/Merchant/edit-product",

  authController.protect,
  authController.authorizedRole("merchant"),
  adminController.postEditProduct
);

router.get(
  "/Merchant/login",
  authController.isLoggedIn,
  adminController.getMerchantlogin
);

router.get(
  "/Merchant/signUp",
  authController.isLoggedIn,
  adminController.getSignUp
);

router.get(
  "/Merchant/add-product",
  authController.isLoggedIn,
  adminController.postProducts
);
router.get(
  "/Merchant/edit-product/:prodId",
  authController.protect,
  authController.authorizedRole("merchant"),
  authController.isLoggedIn,
  adminController.getEditProduct
);

router.get(
  "/Merchant/productStats/:productId/:year",
  adminController.productMonthlyStats
);

router.get(
  "/Merchant/myproductStats/:productId/:year",
  authController.protect,
  authController.authorizedRole("merchant"),
  authController.isLoggedIn,
  adminController.getStatsChart
);
module.exports = router;

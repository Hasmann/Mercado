const path = require("path");
const authController = require("./../controller/auth");
const express = require("express");

const shopController = require("./../controller/UserController");

const router = express.Router();

router.get(
  "/Mercado/User/Search/:textSearch",
  authController.isLoggedIn,
  shopController.getIndex
);
router.get(
  "/Mercado/Home",
  authController.isLoggedIn,
  shopController.getHomePage
);

router.get("/products", authController.isLoggedIn, shopController.getProducts);

router.get(
  "/Mercado/product/:productId",
  authController.isLoggedIn,
  authController.checkProductPage,
  shopController.getProduct
);

router.get(
  "/Mercado/User/cart",
  authController.protect,
  authController.authorizedRole("user"),
  authController.isLoggedIn,
  shopController.getCart
);

router.get(
  "/Mercado/User/Orders",
  authController.protect,
  authController.authorizedRole("user"),
  authController.isLoggedIn,
  shopController.getOrders
);

router.get(
  "/Mercado/User/check-out",
  authController.protect,
  authController.authorizedRole("user"),
  authController.isLoggedIn,
  shopController.checkOut
);

router
  .route("/order/:orderId")
  .get(authController.protect, shopController.downloadInvoice);

router.get(
  "/Mercado/User/SignUp",
  authController.isLoggedIn,
  shopController.getSignUp
);

router.post(
  "/Mercado/User/createOrders",
  authController.protect,
  shopController.createOrders
);
module.exports = router;

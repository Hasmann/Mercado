const express = require("express");
const authController = require("../controller/auth");
const userController = require("../controller/UserController");
const Router = express.Router();
Router.post(
  "/user/wishlist",
  authController.protect,
  authController.authorizedRole("user"),
  userController.addToWishlist
);
// Router.get(
//   "/mercado/user/login",
//   authController.isLoggedIn,
//   userController.getlogin
// );
Router.get(
  "/mercado/user/signUp",
  authController.isLoggedIn,
  userController.getSignUp
);

Router.get("/reset/:resetToken", userController.resetPassword);

Router.post(
  "/Mercado/User/addToCart",
  authController.protect,
  authController.authorizedRole("user"),
  userController.postCart
);

Router.delete(
  "/Mercado/User/cart-delete-item",
  authController.protect,
  authController.authorizedRole("user"),
  userController.postCartDeleteProduct
);
Router.post(
  "/create-order",
  authController.protect,
  authController.authorizedRole("user"),
  userController.postOrder
);
module.exports = Router;

const express = require("express");
const authController = require("../controller/auth.js");
const merchController = require("../controller/merchantController.js");

const Router = express.Router();
Router.post(
  "/merchant/addproduct",
  authController.protect,
  authController.authorizedRole("merchant"),
  merchController.postProductss
);

Router.delete(
  "/Merchant/delete-product",
  authController.protect,
  authController.authorizedRole("merchant"),
  merchController.postDeleteProduct
);

module.exports = Router;
